"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useDeadlines } from "@/lib/queries"

const FALLBACK_DEADLINES = [
  { date: "Apr 25", event: "Q1 tax filing deadline", priority: "Critical" as const },
  { date: "Apr 28", event: "Vendor contract renewal — Acme Corp", priority: "High" as const },
  { date: "May 1", event: "Monthly board report due", priority: "High" as const },
  { date: "May 3", event: "Payroll processing window", priority: "Medium" as const },
  { date: "May 7", event: "Software audit response deadline", priority: "Medium" as const },
]

const PRIORITY_VARIANT = {
  Critical: "danger",
  High: "warning",
  Medium: "secondary",
  Low: "secondary",
} as const

export function LiveDeadlines({ tenantId }: { tenantId: string }) {
  const { data, isLoading } = useDeadlines(tenantId)

  const live = data?.deadlines ?? []
  const items = live.length > 0
    ? live.slice(0, 5).map((d) => ({
        date: d.date,
        event: d.source_subject,
        priority: d.priority,
      }))
    : FALLBACK_DEADLINES

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((d, i) => (
        <div key={`${d.date}-${i}`} className="flex items-start gap-2.5">
          <span className="mt-0.5 min-w-[44px] text-xs font-medium tabular-nums text-muted-foreground">
            {d.date}
          </span>
          <p className="flex-1 truncate text-xs font-medium text-foreground">
            {d.event}
          </p>
          <Badge
            variant={PRIORITY_VARIANT[d.priority as keyof typeof PRIORITY_VARIANT]}
            className="shrink-0 text-[10px]"
          >
            {d.priority}
          </Badge>
        </div>
      ))}
      <Link
        href="/inbox"
        className="mt-1 block text-xs font-medium text-primary hover:underline"
      >
        See all →
      </Link>
    </div>
  )
}
