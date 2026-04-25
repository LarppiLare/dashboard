"use client"

import { useState } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useConnectionsSummary } from "@/lib/queries"
import { formatRelativeTime } from "@/lib/formatters"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"
import type { ConnectionStats } from "@/lib/types"

type IntegrationStatus = "connected" | "disconnected" | "coming_soon"

interface ServiceDef {
  name: string
  key: string
  abbrev: string
  category: string
  implemented: boolean
}

const ALL_SERVICES: ServiceDef[] = [
  { name: "Gmail", key: "gmail", abbrev: "G", category: "Email", implemented: true },
  { name: "Stripe", key: "stripe", abbrev: "S", category: "Payments", implemented: true },
  { name: "HubSpot", key: "hubspot", abbrev: "H", category: "CRM", implemented: true },
  { name: "QuickBooks", key: "quickbooks", abbrev: "Q", category: "Accounting", implemented: false },
  { name: "Google Ads", key: "google-ads", abbrev: "G", category: "Marketing", implemented: false },
  { name: "Meta Ads", key: "meta-ads", abbrev: "M", category: "Marketing", implemented: false },
]

function CardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="mt-4 h-8 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

interface ServiceCardProps {
  svc: ServiceDef
  stats: ConnectionStats | undefined
  tenantId: string
  onDisconnect: (connectionId: string, service: string) => void
  onConnect: (service: string) => void
}

function ServiceCard({ svc, stats, tenantId, onDisconnect, onConnect }: ServiceCardProps) {
  const isConnected = !!stats && stats.status === "active"
  const hasError = stats?.status === "error"

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
            {svc.abbrev}
          </div>
          {!svc.implemented && (
            <Badge variant="secondary" className="text-[10px]">Coming soon</Badge>
          )}
          {svc.implemented && isConnected && (
            <Badge variant="success" className="text-[10px]">Connected</Badge>
          )}
          {svc.implemented && hasError && (
            <Badge variant="danger" className="text-[10px]">Error</Badge>
          )}
          {svc.implemented && stats?.status === "revoked" && (
            <Badge variant="outline" className="text-[10px]">Revoked</Badge>
          )}
          {svc.implemented && !stats && (
            <Badge variant="outline" className="text-[10px]">Not connected</Badge>
          )}
        </div>

        <div className="mt-3">
          <p className="font-semibold text-foreground">{svc.name}</p>
          <p className="text-xs text-muted-foreground">{svc.category}</p>
        </div>

        {stats && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {stats.last_synced_at
              ? `Synced ${formatRelativeTime(stats.last_synced_at)}`
              : "Never synced"}
            {stats.total_records_synced > 0 &&
              ` · ${stats.total_records_synced.toLocaleString()} records`}
          </p>
        )}

        {hasError && stats?.last_error && (
          <p className="mt-1.5 flex items-start gap-1 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{stats.last_error}</span>
          </p>
        )}

        <div className="mt-4">
          {!svc.implemented ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              Coming Soon
            </Button>
          ) : isConnected ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => onDisconnect(stats!.connection_id, svc.key)}
            >
              Disconnect
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={() => onConnect(svc.key)}>
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function IntegrationsGrid({ tenantId }: { tenantId: string }) {
  const { data, isLoading, isError, refetch } = useConnectionsSummary(tenantId)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  async function handleConnect(service: string) {
    setConnecting(service)
    try {
      const result = await apiClient.post<{ auth_url: string }>(
        `/connect/${service}`,
        tenantId
      )
      window.location.href = result.auth_url
    } catch (e) {
      console.error("OAuth start failed:", e)
      setConnecting(null)
    }
  }

  async function handleDisconnect(connectionId: string, service: string) {
    if (!confirm(`Disconnect ${service}? This stops syncing until you reconnect.`)) return
    setDisconnecting(connectionId)
    try {
      await apiClient.delete(`/connections/${service}/${connectionId}`, tenantId)
      await refetch()
    } catch (e) {
      console.error("Disconnect failed:", e)
    } finally {
      setDisconnecting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-12 text-center shadow-card">
        <AlertCircle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">Could not load integrations</p>
        <p className="text-xs text-muted-foreground">
          Make sure the integration platform is running at localhost:8000.
        </p>
        <Button variant="outline" size="sm" className="mt-2 gap-1.5" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </Button>
      </div>
    )
  }

  // Index stats by service for O(1) lookups
  const statsByService = Object.fromEntries(
    (data?.connections ?? []).map((c) => [c.service, c])
  )

  return (
    <>
      {(connecting || disconnecting) && (
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-card">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          {connecting ? `Starting OAuth for ${connecting}…` : "Disconnecting…"}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {ALL_SERVICES.map((svc) => (
          <ServiceCard
            key={svc.key}
            svc={svc}
            stats={statsByService[svc.key]}
            tenantId={tenantId}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>
    </>
  )
}
