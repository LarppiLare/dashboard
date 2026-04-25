const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(
  path: string,
  tenantId: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Customer-ID": tenantId,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, text)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, tenantId: string, init?: RequestInit) =>
    request<T>(path, tenantId, { method: "GET", ...init }),

  post: <T>(path: string, tenantId: string, body?: unknown) =>
    request<T>(path, tenantId, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, tenantId: string) =>
    request<T>(path, tenantId, { method: "DELETE" }),
}
