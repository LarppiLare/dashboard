import { KpiCardSkeleton, ChartCardSkeleton, Skeleton } from "@/components/skeleton"

export default function CustomersLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>

      {/* Pipeline kanban */}
      <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((col) => (
            <div key={col} className="space-y-2">
              <div className="flex items-center justify-between mb-2.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-4" />
              </div>
              {[0, 1, 2].map((row) => (
                row < (col === 3 ? 2 : 3) ? (
                  <div key={row} className="rounded-lg border border-border/50 bg-muted/30 p-2.5 space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2.5 w-3/4" />
                    <div className="flex items-center justify-between mt-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-12 rounded-full" />
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Contact growth + Top deals */}
      <div className="grid grid-cols-2 gap-4">
        <ChartCardSkeleton />
        <div className="rounded-xl border bg-card p-6 shadow-card space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-40" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-t border-border">
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
