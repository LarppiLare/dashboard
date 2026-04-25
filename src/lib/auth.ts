export interface Tenant {
  id: string
  name: string
  locale: string
  currency: string
}

// Stub: replace with real cookie/JWT validation when auth is wired up.
export async function getCurrentTenant(): Promise<Tenant> {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Demo Company",
    locale: "en-US",
    currency: "USD",
  }
}
