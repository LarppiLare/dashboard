"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { subDays } from "date-fns"

export type Granularity = "daily" | "weekly" | "monthly"

export interface Period {
  from: Date
  to: Date
  granularity: Granularity
}

interface PeriodContextValue {
  period: Period
  setPeriod: (period: Period) => void
}

const PeriodContext = createContext<PeriodContextValue | null>(null)

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>({
    from: subDays(new Date(), 30),
    to: new Date(),
    granularity: "monthly",
  })

  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  )
}

export function usePeriod() {
  const ctx = useContext(PeriodContext)
  if (!ctx) throw new Error("usePeriod must be used within PeriodProvider")
  return ctx
}
