import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-9 w-36" />
      <Skeleton className="mt-2.5 h-4 w-24" />
    </div>
  )
}

export function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-card", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
      <Skeleton className="mt-6 h-48 w-full rounded-lg" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
