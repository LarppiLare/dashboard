"use client"

import { useRevenue } from "@/lib/queries"
import { KpiCard } from "@/components/kpi-card"
import { AlertCircle } from "lucide-react"

const REVENUE_SPARK = [4200, 3800, 5100, 4600, 5900, 6200, 5800, 7100, 6500, 7800, 8200, 9100]

export function RevenueKpi({ tenantId }: { tenantId: string }) {
  const { data, isLoading } = useRevenue(tenantId)

  if (!data?.connected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-xs font-medium text-amber-900 dark:text-amber-200">Stripe not connected</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300">Configure STRIPE_API_KEY in backend .env</p>
        </div>
      </div>
    )
  }

  return (
    <KpiCard
      title="Revenue this period"
      value={`€${data.total_revenue?.toLocaleString("de-DE", { maximumFractionDigits: 0 }) ?? "0"}`}
      deltaPercent={data.change_percent ?? 0}
      sparkline={REVENUE_SPARK}
    />
  )
}
