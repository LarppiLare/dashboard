import { getCurrentTenant } from "@/lib/auth"
import { IntegrationsGrid } from "./integrations-grid"

export default async function IntegrationsPage() {
  const tenant = await getCurrentTenant()
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your connected services
        </p>
      </div>
      <IntegrationsGrid tenantId={tenant.id} />
    </div>
  )
}
