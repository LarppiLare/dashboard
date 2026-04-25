import { Megaphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const SERVICES = [
  {
    name: "Google Ads",
    abbrev: "G",
    desc: "Ad spend, conversions, ROAS, and keyword performance from your Google Ads account.",
    previews: ["Campaign ROAS", "Keyword spend", "Conversion funnel"],
  },
  {
    name: "Meta Ads",
    abbrev: "M",
    desc: "Facebook and Instagram campaign metrics, audience insights, and cost per result.",
    previews: ["Cost per result", "Audience reach", "Creative performance"],
  },
]

export default function MarketingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Marketing</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Campaign performance and attribution
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SERVICES.map((s) => (
          <Card key={s.name}>
            <CardContent className="flex flex-col items-center py-14 text-center">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {s.abbrev}
                </div>
                <Badge
                  variant="secondary"
                  className="absolute -right-3 -top-2 text-[10px]"
                >
                  Soon
                </Badge>
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                Connect {s.name}
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                {s.desc}
              </p>

              <div className="mt-5 flex gap-2">
                {s.previews.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <Button variant="outline" className="mt-6" disabled>
                <Megaphone className="mr-2 h-4 w-4" aria-hidden="true" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
