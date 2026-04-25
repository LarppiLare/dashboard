import { KpiCardSkeleton, ChartCardSkeleton, Skeleton } from "@/components/skeleton"

export default function RevenueLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>

      {/* 6-month chart */}
      <ChartCardSkeleton />

      {/* Product table + Segment breakdown */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 rounded-xl border bg-card p-6 shadow-card space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-32" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-t border-border">
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-16 tabular-nums" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
        <div className="col-span-2 rounded-xl border bg-card p-6 shadow-card space-y-5">
          <Skeleton className="h-5 w-40" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
