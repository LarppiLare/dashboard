"use client"

import { format } from "date-fns"
import { usePeriod } from "@/contexts/period-context"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PeriodBadgeProps {
  className?: string
}

export function PeriodBadge({ className }: PeriodBadgeProps) {
  const { period } = usePeriod()
  return (
    <Badge variant="secondary" className={cn("text-xs font-normal tabular-nums", className)}>
      {format(period.from, "MMM d")}
      {" – "}
      {format(period.to, "MMM d, yyyy")}
    </Badge>
  )
}
