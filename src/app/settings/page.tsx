import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tenant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Company Name
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Demo Company
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Tenant ID
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  00000000-0000-0000-0000-000000000001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Display Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Currency",
                desc: "Used for all revenue and cost displays",
                value: "USD ($)",
              },
              {
                label: "Locale",
                desc: "Controls date and number formatting",
                value: "en-US",
              },
              {
                label: "Timezone",
                desc: "Used for relative time labels",
                value: "UTC",
              },
            ].map((pref, i, arr) => (
              <div key={pref.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {pref.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {pref.value}
                  </span>
                </div>
                {i < arr.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sync Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Background sync interval
                </p>
                <p className="text-xs text-muted-foreground">
                  How often the platform polls each connected service
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Every 15 min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
