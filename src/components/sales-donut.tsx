"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import { formatCurrency, formatPercent } from "@/lib/formatters"

interface ChannelData {
  name: string
  value: number
  color: string
}

// Replaced with real Stripe payment_method_details data in Step 3
const MOCK_DATA: ChannelData[] = [
  { name: "Direct / Card", value: 42000, color: "#6366F1" },
  { name: "Organic Search", value: 24000, color: "#818cf8" },
  { name: "Referral", value: 12000, color: "#a5b4fc" },
  { name: "Paid Ads", value: 6230, color: "#c7d2fe" },
]

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload as ChannelData
  const total = MOCK_DATA.reduce((s, x) => s + x.value, 0)
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-card-hover dark:bg-card">
      <div className="flex items-center gap-2 text-xs">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: d.color }}
        />
        <span className="font-medium text-foreground">{d.name}</span>
      </div>
      <p className="mt-1 text-xs tabular-nums text-muted-foreground">
        {formatCurrency(d.value)}{" "}
        <span className="font-medium text-foreground">
          ({formatPercent((d.value / total) * 100)})
        </span>
      </p>
    </div>
  )
}

interface SalesDonutProps {
  data?: ChannelData[]
}

export function SalesDonut({ data = MOCK_DATA }: SalesDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex items-center gap-4">
      {/* Donut */}
      <div className="relative h-[140px] w-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={66}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[11px] text-muted-foreground">Total</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-1 flex-col gap-2.5">
        {data.map((d) => {
          const pct = ((d.value / total) * 100).toFixed(1)
          return (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="truncate text-xs text-muted-foreground">{d.name}</span>
              </div>
              <span className="shrink-0 text-xs font-medium tabular-nums text-foreground">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
