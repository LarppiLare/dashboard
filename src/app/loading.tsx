import { KpiCardSkeleton, ChartCardSkeleton, Skeleton, TableRowSkeleton } from "@/components/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>

      {/* Revenue + deadlines */}
      <div className="grid grid-cols-3 gap-4">
        <ChartCardSkeleton className="col-span-2" />
        <div className="rounded-xl border bg-card p-6 shadow-card space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-32" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 h-3 w-10 shrink-0" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Donut + customers */}
      <div className="grid grid-cols-2 gap-4">
        <ChartCardSkeleton />
        <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-32" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Integrations table */}
      <div className="rounded-xl border bg-card p-6 shadow-card space-y-1">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mb-4 h-3 w-56" />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  )
}
