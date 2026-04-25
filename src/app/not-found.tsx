import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-24">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <LayoutDashboard className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">Page not found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
