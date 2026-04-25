"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-24">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">Something went wrong</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{error.message}</p>
        {error.digest && (
          <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
            {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Try again
      </Button>
    </div>
  )
}
