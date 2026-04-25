import { TrendingDown, TrendingUp } from "lucide-react"
import { KpiCard } from "@/components/kpi-card"
import { RevenueChart } from "@/components/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PeriodBadge } from "@/components/period-badge"
import { formatCurrency } from "@/lib/formatters"

// ── Mock data (replace with API calls once storage tables exist) ───────────────

const REVENUE_DATA = [
  { month: "Nov", saas: 19000, services: 7200, other: 2800 },
  { month: "Dec", saas: 22000, services: 8100, other: 3100 },
  { month: "Jan", saas: 24500, services: 7900, other: 3400 },
  { month: "Feb", saas: 22000, services: 8500, other: 3200 },
  { month: "Mar", saas: 28000, services: 9800, other: 4100 },
  { month: "Apr", saas: 34000, services: 12400, other: 5800 },
]

const PRODUCTS = [
  { name: "Enterprise SaaS", revenue: 34500, delta: 8.2, spark: [24, 26, 28, 30, 29, 32, 34, 35] },
  { name: "Professional Services", revenue: 12400, delta: 5.1, spark: [9, 8, 10, 9, 11, 10, 12, 12] },
  { name: "Starter SaaS", revenue: 18200, delta: 12.3, spark: [12, 13, 14, 15, 15, 16, 17, 18] },
  { name: "Add-ons & Extensions", revenue: 5800, delta: -2.1, spark: [6, 7, 6, 5, 6, 5, 6, 6] },
  { name: "One-time Consulting", revenue: 13330, delta: 1.5, spark: [10, 11, 12, 11, 13, 12, 13, 13] },
]

const SEGMENTS = [
  { name: "Enterprise", pct: 42, revenue: 35400 },
  { name: "Mid-Market", pct: 34, revenue: 28600 },
  { name: "SMB", pct: 24, revenue: 20230 },
]

const CHURN_SIGNALS = [
  { label: "At-risk accounts (no activity 30d)", count: 3, warn: true },
  { label: "Downgrade requests this month", count: 1, warn: true },
  { label: "Cancellations pending", count: 0, warn: false },
]

// ── Inline SVG sparkline (no Recharts overhead for table rows) ────────────────

function InlineSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 56, H = 20
  const pts = data
    .map((v, i) => {
      const x = ((i / (data.length - 1)) * W).toFixed(1)
      const y = (H - ((v - min) / range) * (H - 2) - 1).toFixed(1)
      return `${x},${y}`
    })
    .join(" ")
  return (
    <svg width={W} height={H} aria-hidden="true" className="ml-auto">
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Revenue</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Subscription metrics and revenue breakdown
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          title="Monthly Recurring Revenue"
          value="$28,077"
          deltaPercent={3.2}
          sparkline={[24, 25, 26, 26, 27, 27, 28, 28]}
        />
        <KpiCard
          title="Annual Run Rate"
          value="$336,924"
          deltaPercent={15.4}
          sparkline={[280, 292, 300, 308, 314, 320, 330, 337]}
        />
        <KpiCard
          title="Monthly Churn Rate"
          value="2.1%"
          deltaPercent={-14.3}
          sparkline={[2.8, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.1]}
        />
      </div>

      {/* 6-month chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Stacked by revenue stream, last 6 months
            </p>
          </div>
          <PeriodBadge />
        </CardHeader>
        <CardContent>
          <RevenueChart data={REVENUE_DATA} />
        </CardContent>
      </Card>

      {/* Product table + Segment breakdown */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Revenue by Product</CardTitle>
            <p className="text-xs text-muted-foreground">
              This period vs. previous period
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2.5 text-left text-xs font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="pb-2.5 text-right text-xs font-medium text-muted-foreground">
                    Revenue
                  </th>
                  <th className="pb-2.5 text-right text-xs font-medium text-muted-foreground">
                    MoM
                  </th>
                  <th className="pb-2.5 text-right text-xs font-medium text-muted-foreground">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PRODUCTS.map((p) => (
                  <tr key={p.name}>
                    <td className="py-2.5 text-xs font-medium text-foreground">
                      {p.name}
                    </td>
                    <td className="py-2.5 text-right text-xs font-semibold tabular-nums text-foreground">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          p.delta >= 0
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {p.delta >= 0 ? (
                          <TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5" aria-hidden="true" />
                        )}
                        {p.delta >= 0 ? "+" : ""}
                        {p.delta}%
                      </span>
                    </td>
                    <td className="py-2.5">
                      <InlineSparkline data={p.spark} positive={p.delta >= 0} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">By Customer Segment</CardTitle>
            <p className="text-xs text-muted-foreground">
              HubSpot company size × Stripe revenue
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {SEGMENTS.map((seg) => (
              <div key={seg.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {seg.name}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {seg.pct}%
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                      {formatCurrency(seg.revenue)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${seg.pct}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Churn signals */}
            <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3.5 space-y-2.5">
              <p className="text-xs font-semibold text-foreground">
                Churn Signals
              </p>
              {CHURN_SIGNALS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      row.count > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
