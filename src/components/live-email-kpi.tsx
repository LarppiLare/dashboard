"use client"

import { KpiCard } from "@/components/kpi-card"
import { useEmailKpi } from "@/lib/queries"

const EMAIL_SPARK = [9, 7, 11, 8, 6, 9, 12, 8, 7, 10, 9, 7]

export function LiveEmailKpi({ tenantId }: { tenantId: string }) {
  const { data } = useEmailKpi(tenantId)
  const value = data?.unread_important

  return (
    <KpiCard
      title="Unread Important Emails"
      value={value !== undefined && value !== null ? String(value) : "7"}
      deltaPercent={-14.3}
      sparkline={EMAIL_SPARK}
    />
  )
}
