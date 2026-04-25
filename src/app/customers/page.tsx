import { ContactChart } from "@/components/contact-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KpiCard } from "@/components/kpi-card"
import { formatCurrency, formatRelativeTime } from "@/lib/formatters"

// ── Mock data ─────────────────────────────────────────────────────────────────

const CONTACT_GROWTH = [
  { month: "Nov", contacts: 423, deals: 18 },
  { month: "Dec", contacts: 456, deals: 22 },
  { month: "Jan", contacts: 498, deals: 25 },
  { month: "Feb", contacts: 531, deals: 28 },
  { month: "Mar", contacts: 572, deals: 31 },
  { month: "Apr", contacts: 614, deals: 35 },
]

interface Deal {
  company: string
  contact: string
  value: number
  daysInStage: number
  priority: "Critical" | "High" | "Medium" | "Low"
}

const PIPELINE_STAGES: { name: string; color: string; deals: Deal[] }[] = [
  {
    name: "Lead",
    color: "bg-slate-100 dark:bg-slate-800",
    deals: [
      { company: "Helix Tech", contact: "Sarah Chen", value: 8000, daysInStage: 3, priority: "Medium" },
      { company: "DataFlow Ltd", contact: "Mark Davis", value: 12000, daysInStage: 7, priority: "High" },
      { company: "Orbit Systems", contact: "Priya Nair", value: 6500, daysInStage: 1, priority: "Low" },
    ],
  },
  {
    name: "Qualified",
    color: "bg-violet-50 dark:bg-violet-950/40",
    deals: [
      { company: "Nexus Corp", contact: "James Wright", value: 22000, daysInStage: 5, priority: "High" },
      { company: "Apex Global", contact: "Linda Torres", value: 18500, daysInStage: 9, priority: "Medium" },
      { company: "BlueWave Inc", contact: "Chris Kim", value: 14000, daysInStage: 11, priority: "High" },
    ],
  },
  {
    name: "Proposal",
    color: "bg-amber-50 dark:bg-amber-950/40",
    deals: [
      { company: "Initech Solutions", contact: "Bob Lee", value: 28000, daysInStage: 6, priority: "Critical" },
      { company: "MetaCorp", contact: "Emily Brown", value: 35000, daysInStage: 14, priority: "High" },
      { company: "Vertex AI", contact: "David Park", value: 19000, daysInStage: 4, priority: "Medium" },
    ],
  },
  {
    name: "Negotiation",
    color: "bg-orange-50 dark:bg-orange-950/40",
    deals: [
      { company: "Umbrella Ltd", contact: "Alice Wu", value: 31000, daysInStage: 8, priority: "Critical" },
      { company: "Phantom Tech", contact: "Ryan Moss", value: 24000, daysInStage: 12, priority: "High" },
    ],
  },
  {
    name: "Closed Won",
    color: "bg-emerald-50 dark:bg-emerald-950/40",
    deals: [
      { company: "Dunder Mifflin", contact: "Michael Scott", value: 20000, daysInStage: 0, priority: "High" },
      { company: "Acme Corp", contact: "John Smith", value: 18400, daysInStage: 0, priority: "Medium" },
    ],
  },
]

const TOP_DEALS = [
  { company: "MetaCorp", stage: "Proposal", value: 35000, owner: "Emily Brown", lastActivity: new Date(Date.now() - 3600000).toISOString() },
  { company: "Umbrella Ltd", stage: "Negotiation", value: 31000, owner: "Alice Wu", lastActivity: new Date(Date.now() - 7200000).toISOString() },
  { company: "Initech Solutions", stage: "Proposal", value: 28000, owner: "Bob Lee", lastActivity: new Date(Date.now() - 18000000).toISOString() },
  { company: "Phantom Tech", stage: "Negotiation", value: 24000, owner: "Ryan Moss", lastActivity: new Date(Date.now() - 86400000).toISOString() },
  { company: "Nexus Corp", stage: "Qualified", value: 22000, owner: "James Wright", lastActivity: new Date(Date.now() - 172800000).toISOString() },
]

const PRIORITY_VARIANT = {
  Critical: "danger",
  High: "warning",
  Medium: "secondary",
  Low: "outline",
} as const

const STAGE_BADGE_VARIANT = {
  Lead: "secondary",
  Qualified: "default",
  Proposal: "warning",
  Negotiation: "danger",
  "Closed Won": "success",
} as const

const totalPipeline = PIPELINE_STAGES.flatMap((s) => s.deals).reduce(
  (sum, d) => sum + d.value,
  0
)

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          HubSpot pipeline and contact analytics
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          title="Total Contacts"
          value="614"
          deltaPercent={7.4}
          sparkline={[423, 456, 498, 531, 572, 614]}
        />
        <KpiCard
          title="Open Deals"
          value="35"
          deltaPercent={12.9}
          sparkline={[18, 22, 25, 28, 31, 35]}
        />
        <KpiCard
          title="Pipeline Value"
          value={formatCurrency(totalPipeline)}
          deltaPercent={9.1}
          sparkline={[280, 290, 295, 310, 318, 326]}
        />
      </div>

      {/* Pipeline kanban */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Deal Pipeline</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatCurrency(totalPipeline)} total pipeline value
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-normal">
              {PIPELINE_STAGES.flatMap((s) => s.deals).length} deals
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3 overflow-x-auto">
            {PIPELINE_STAGES.map((stage) => {
              const stageTotal = stage.deals.reduce((s, d) => s + d.value, 0)
              return (
                <div key={stage.name} className="min-w-[160px]">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {stage.name}
                    </span>
                    <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                      {stage.deals.length}
                    </span>
                  </div>
                  <p className="mb-2 text-[11px] font-medium tabular-nums text-muted-foreground">
                    {formatCurrency(stageTotal)}
                  </p>
                  <div className="space-y-2">
                    {stage.deals.map((deal) => (
                      <div
                        key={deal.company}
                        className={`rounded-lg p-2.5 ${stage.color} border border-border/50`}
                      >
                        <p className="text-xs font-semibold text-foreground truncate">
                          {deal.company}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {deal.contact}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[11px] font-semibold tabular-nums text-foreground">
                            {formatCurrency(deal.value)}
                          </span>
                          {stage.name !== "Closed Won" && (
                            <Badge
                              variant={PRIORITY_VARIANT[deal.priority]}
                              className="text-[9px] px-1 py-0"
                            >
                              {deal.priority}
                            </Badge>
                          )}
                        </div>
                        {stage.name !== "Closed Won" && deal.daysInStage > 0 && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {deal.daysInStage}d in stage
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact growth + Top deals */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Growth</CardTitle>
            <p className="text-xs text-muted-foreground">
              Contacts and open deals over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-4">
              {[
                { label: "Contacts", color: "#6366F1" },
                { label: "Open Deals", color: "#a5b4fc" },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
            <ContactChart data={CONTACT_GROWTH} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Deals</CardTitle>
            <p className="text-xs text-muted-foreground">Highest-value open opportunities</p>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Company</th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Stage</th>
                  <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Value</th>
                  <th className="pb-2 text-right text-xs font-medium text-muted-foreground">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TOP_DEALS.map((d) => (
                  <tr key={d.company}>
                    <td className="py-2.5">
                      <p className="text-xs font-medium text-foreground">{d.company}</p>
                      <p className="text-[10px] text-muted-foreground">{d.owner}</p>
                    </td>
                    <td className="py-2.5">
                      <Badge
                        variant={STAGE_BADGE_VARIANT[d.stage as keyof typeof STAGE_BADGE_VARIANT]}
                        className="text-[10px]"
                      >
                        {d.stage}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right text-xs font-semibold tabular-nums text-foreground">
                      {formatCurrency(d.value)}
                    </td>
                    <td className="py-2.5 text-right text-[10px] tabular-nums text-muted-foreground">
                      {formatRelativeTime(d.lastActivity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
