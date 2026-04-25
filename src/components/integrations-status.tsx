"use client"

import Link from "next/link"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useConnectionsSummary } from "@/lib/queries"
import { formatRelativeTime } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/skeleton"
import type { ConnectionStats } from "@/lib/types"

// Service display metadata — static
const SERVICE_META: Record<string, { label: string; abbrev: string }> = {
  gmail: { label: "Gmail", abbrev: "G" },
  stripe: { label: "Stripe", abbrev: "S" },
  hubspot: { label: "HubSpot", abbrev: "H" },
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active")
    return <Badge variant="success">Healthy</Badge>
  if (status === "error")
    return <Badge variant="danger">Error</Badge>
  if (status === "revoked")
    return <Badge variant="outline">Revoked</Badge>
  return <Badge variant="secondary">{status}</Badge>
}

function IntegrationRow({ conn }: { conn: ConnectionStats }) {
  const meta = SERVICE_META[conn.service] ?? {
    label: conn.service,
    abbrev: conn.service[0].toUpperCase(),
  }

  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {meta.abbrev}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{meta.label}</p>
          <p className="text-xs text-muted-foreground">
            {conn.last_synced_at
              ? `Last synced ${formatRelativeTime(conn.last_synced_at)}`
              : "Never synced"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-xs tabular-nums text-muted-foreground">
          {conn.total_records_synced.toLocaleString()} records total
        </span>
        <StatusBadge status={conn.status} />
        {conn.status === "error" && conn.last_error && (
          <span
            className="flex items-center gap-1 text-xs text-destructive"
            title={conn.last_error}
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Error
          </span>
        )}
      </div>
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="divide-y divide-border">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface IntegrationsStatusProps {
  tenantId: string
}

export function IntegrationsStatus({ tenantId }: IntegrationsStatusProps) {
  const { data, isLoading, isError, refetch, isFetching } = useConnectionsSummary(tenantId)

  if (isLoading) return <LoadingRows />

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <AlertCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Could not load integration status.{" "}
          <button
            onClick={() => refetch()}
            className="font-medium text-primary hover:underline"
          >
            Retry
          </button>
        </p>
      </div>
    )
  }

  const connections = data?.connections ?? []

  if (connections.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No integrations connected yet.{" "}
          <Link href="/integrations" className="font-medium text-primary hover:underline">
            Connect a service →
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {isFetching && !isLoading && (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3 animate-spin" aria-hidden="true" />
          Refreshing…
        </div>
      )}
      {connections.map((conn) => (
        <IntegrationRow key={conn.connection_id} conn={conn} />
      ))}
    </div>
  )
}
