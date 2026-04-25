"use client"

import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from "date-fns"
import { Calendar, Filter, Download, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePeriod, type Granularity, type Period } from "@/contexts/period-context"
import { cn } from "@/lib/utils"

const GRANULARITIES: { label: string; value: Granularity }[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
  { label: "Daily", value: "daily" },
]

interface Preset {
  label: string
  build: () => Omit<Period, "granularity">
  granularity: Granularity
}

const PRESETS: Preset[] = [
  {
    label: "Last 7 days",
    build: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    granularity: "daily",
  },
  {
    label: "Last 30 days",
    build: () => ({ from: subDays(new Date(), 30), to: new Date() }),
    granularity: "daily",
  },
  {
    label: "This month",
    build: () => ({ from: startOfMonth(new Date()), to: new Date() }),
    granularity: "daily",
  },
  {
    label: "Last 3 months",
    build: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
    granularity: "monthly",
  },
  {
    label: "Last 6 months",
    build: () => ({ from: subMonths(new Date(), 6), to: new Date() }),
    granularity: "monthly",
  },
  {
    label: "Last 12 months",
    build: () => ({ from: subMonths(new Date(), 12), to: new Date() }),
    granularity: "monthly",
  },
  {
    label: "Year to date",
    build: () => ({ from: startOfYear(new Date()), to: new Date() }),
    granularity: "monthly",
  },
]

function isMatchingPreset(period: Period, preset: Preset): boolean {
  const built = preset.build()
  return (
    period.granularity === preset.granularity &&
    Math.abs(period.from.getTime() - built.from.getTime()) < 60_000 * 5
  )
}

export function PeriodSelector() {
  const { period, setPeriod } = usePeriod()
  const activePreset = PRESETS.find((p) => isMatchingPreset(period, p))

  return (
    <div className="flex items-center gap-2">
      {/* Granularity toggle */}
      <div
        className="flex overflow-hidden rounded-lg border border-border bg-white shadow-sm dark:bg-card"
        role="group"
        aria-label="Time granularity"
      >
        {GRANULARITIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setPeriod({ ...period, granularity: value })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors duration-150",
              period.granularity === value
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-pressed={period.granularity === value}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Date range + presets */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-medium"
            aria-label="Select date range"
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {activePreset ? (
              activePreset.label
            ) : (
              <>
                {format(period.from, "MMM d")}
                {" – "}
                {format(period.to, "MMM d, yyyy")}
              </>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-44 p-1.5">
          <div className="space-y-0.5" role="menu" aria-label="Date range presets">
            {PRESETS.map((preset) => {
              const isActive = isMatchingPreset(period, preset)
              return (
                <button
                  key={preset.label}
                  role="menuitem"
                  onClick={() => {
                    const range = preset.build()
                    setPeriod({ ...range, granularity: preset.granularity })
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {preset.label}
                  {isActive && (
                    <Check className="h-3 w-3" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Filter */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label="Filter dashboard"
      >
        <Filter className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>

      {/* Export CSV */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label="Export as CSV"
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}
