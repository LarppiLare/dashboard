import Link from "next/link"
import { getCurrentTenant } from "@/lib/auth"
import { KpiCard } from "@/components/kpi-card"
import { RevenueChart } from "@/components/revenue-chart"
import { SalesDonut } from "@/components/sales-donut"
import { IntegrationsStatus } from "@/components/integrations-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PeriodBadge } from "@/components/period-badge"

// These will be replaced with TanStack Query hooks in Step 3 refinement
// once adapter-specific storage tables are added to the backend.
const REV_SPARK = [28, 32, 29, 35, 38, 34, 42, 39, 45, 48, 44, 52]
const CUST_SPARK = [4, 7, 5, 9, 11, 8, 13, 10, 14, 12, 16, 18]
const EMAIL_SPARK = [9, 7, 11, 8, 6, 9, 12, 8, 7, 10, 9, 7]

const MOCK_DEADLINES = [
  { date: "Apr 25", event: "Q1 tax filing deadline", priority: "Critical" as const },
  { date: "Apr 28", event: "Vendor contract renewal — Acme Corp", priority: "High" as const },
  { date: "May 1", event: "Monthly board report due", priority: "High" as const },
  { date: "May 3", event: "Payroll processing window", priority: "Medium" as const },
  { date: "May 7", event: "Software audit response deadline", priority: "Medium" as const },
]

const MOCK_CUSTOMERS = [
  { name: "Acme Corp", revenue: "$18,400", lastActivity: "2d ago" },
  { name: "Globex Industries", revenue: "$12,100", lastActivity: "5d ago" },
  { name: "Initech Solutions", revenue: "$9,850", lastActivity: "1d ago" },
  { name: "Umbrella Ltd", revenue: "$7,200", lastActivity: "Today" },
  { name: "Dunder Mifflin", revenue: "$5,600", lastActivity: "3d ago" },
]

const PRIORITY_VARIANT = {
  Critical: "danger",
  High: "warning",
  Medium: "secondary",
  Low: "secondary",
} as const

export default async function DashboardPage() {
  const tenant = await getCurrentTenant()

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Your business at a glance</p>
      </div>

      {/* Row 1 — KPI tiles */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          title="Revenue this period"
          value="$84,230"
          deltaPercent={12.5}
          sparkline={REV_SPARK}
        />
        <KpiCard
          title="New Customers"
          value="142"
          deltaPercent={8.3}
          sparkline={CUST_SPARK}
        />
        <KpiCard
          title="Unread Important Emails"
          value="7"
          deltaPercent={-14.3}
          sparkline={EMAIL_SPARK}
        />
      </div>

      {/* Row 2 — Revenue chart + Deadlines */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Revenue Overview</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Stacked by revenue stream, last 3 months
              </p>
            </div>
            <PeriodBadge />
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            <p className="text-xs text-muted-foreground">AI-extracted from emails</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_DEADLINES.map((d) => (
              <div key={d.event} className="flex items-start gap-2.5">
                <span className="mt-0.5 min-w-[44px] text-xs font-medium tabular-nums text-muted-foreground">
                  {d.date}
                </span>
                <p className="flex-1 truncate text-xs font-medium text-foreground">
                  {d.event}
                </p>
                <Badge
                  variant={PRIORITY_VARIANT[d.priority]}
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
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Donut + Top Customers */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sales by Channel</CardTitle>
            <p className="text-xs text-muted-foreground">Revenue split by payment source</p>
          </CardHeader>
          <CardContent>
            <SalesDonut />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Customers</CardTitle>
            <p className="text-xs text-muted-foreground">By revenue this period</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_CUSTOMERS.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                    #{i + 1}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {c.revenue}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — Live integration status (real data from API) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Connected Integrations</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Live sync status across all services
              </p>
            </div>
            <Link
              href="/integrations"
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <IntegrationsStatus tenantId={tenant.id} />
        </CardContent>
      </Card>
    </div>
  )
}
