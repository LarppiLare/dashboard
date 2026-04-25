import { CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PREVIEWS = [
  {
    title: "Expense Overview",
    desc: "Monthly cost breakdown by category",
  },
  {
    title: "Vendor Spend",
    desc: "Top vendors ranked by total spend",
  },
  {
    title: "Budget vs Actual",
    desc: "Real-time budget tracking by department",
  },
]

export default function CostsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Costs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Expense tracking and cost analysis
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <CreditCard className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-foreground">
            Connect QuickBooks
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Connect your QuickBooks account to see expense breakdowns, vendor
            costs, and budget tracking — all in one place.
          </p>
          <Button className="mt-6" size="lg">
            Connect QuickBooks
          </Button>

          {/* "What you'll see" preview */}
          <div className="mt-10 w-full max-w-md border-t border-border pt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              What you'll see here
            </p>
            <div className="grid grid-cols-3 gap-3 text-left">
              {PREVIEWS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg bg-muted/50 p-3"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
