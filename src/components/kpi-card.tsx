import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SparklineProps {
  data: number[]
  color: "green" | "red" | "neutral"
}

function Sparkline({ data, color }: SparklineProps) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 64
  const H = 28
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W
      const y = H - ((v - min) / range) * (H - 2) - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  const strokeColor =
    color === "green"
      ? "hsl(142 71% 45%)"
      : color === "red"
        ? "hsl(0 72% 51%)"
        : "hsl(220 9% 60%)"

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="opacity-70"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface KpiCardProps {
  title: string
  value: string
  deltaPercent: number
  sparkline?: number[]
  className?: string
}

export function KpiCard({ title, value, deltaPercent, sparkline, className }: KpiCardProps) {
  const isPositive = deltaPercent > 0
  const isNeutral = deltaPercent === 0
  const sparkColor = isNeutral ? "neutral" : isPositive ? "green" : "red"

  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-card", className)}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold tabular-nums text-foreground leading-none">
            {value}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            {isNeutral ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                <Minus className="h-3 w-3" aria-hidden="true" />
                0%
              </span>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3 w-3" aria-hidden="true" />
                )}
                {isPositive ? "+" : ""}
                {deltaPercent.toFixed(1)}%
              </span>
            )}
            <span className="text-xs text-muted-foreground">vs prev. period</span>
          </div>
        </div>

        {sparkline && <Sparkline data={sparkline} color={sparkColor} />}
      </div>
    </div>
  )
}
