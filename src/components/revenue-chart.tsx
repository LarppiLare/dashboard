"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import { formatCurrency } from "@/lib/formatters"

interface RevenuePoint {
  month: string
  saas: number
  services: number
  other: number
}

// Replaced with real Stripe data in Step 3
const MOCK_DATA: RevenuePoint[] = [
  { month: "Feb", saas: 22000, services: 8500, other: 3200 },
  { month: "Mar", saas: 28000, services: 9800, other: 4100 },
  { month: "Apr", saas: 34000, services: 12400, other: 5800 },
]

const SERIES = [
  { key: "saas", label: "SaaS", color: "#6366F1" },
  { key: "services", label: "Services", color: "#a5b4fc" },
  { key: "other", label: "Other", color: "#ddd6fe" },
] as const

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0)
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5 shadow-card-hover dark:bg-card">
      <p className="mb-2 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: p.fill }}
            />
            {SERIES.find((s) => s.key === p.dataKey)?.label}
          </span>
          <span className="font-semibold tabular-nums text-foreground">
            {formatCurrency(p.value ?? 0)}
          </span>
        </div>
      ))}
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold tabular-nums text-foreground">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  )
}

function TickY({ x, y, payload }: { x?: number; y?: number; payload?: { value: number } }) {
  if (x == null || y == null || !payload) return null
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="hsl(220 9% 46%)" fontSize={11}>
      {formatCurrency(payload.value / 1000)}k
    </text>
  )
}

interface RevenueChartProps {
  data?: RevenuePoint[]
}

export function RevenueChart({ data = MOCK_DATA }: RevenueChartProps) {
  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-4">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barCategoryGap="28%"
          barGap={2}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="hsl(220 13% 91%)"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(220 9% 46%)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={<TickY />}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(220 14% 96%)", radius: 4 }}
          />
          {SERIES.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="stack"
              fill={s.color}
              radius={s.key === "other" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
