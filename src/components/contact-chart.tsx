"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

interface ContactPoint {
  month: string
  contacts: number
  deals: number
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-card-hover dark:bg-card">
      <p className="mb-1.5 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.stroke }} />
            {p.dataKey === "contacts" ? "Contacts" : "Open Deals"}
          </span>
          <span className="font-semibold tabular-nums text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

interface ContactChartProps {
  data: ContactPoint[]
}

export function ContactChart({ data }: ContactChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="contactsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="dealsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }} width={32} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="contacts"
          stroke="#6366F1"
          strokeWidth={2}
          fill="url(#contactsGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#6366F1" }}
        />
        <Area
          type="monotone"
          dataKey="deals"
          stroke="#a5b4fc"
          strokeWidth={2}
          fill="url(#dealsGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#a5b4fc" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
