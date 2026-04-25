"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "./api-client"
import type { ConnectionsSummary, SyncHistory } from "./types"

// ── Key factories ──────────────────────────────────────────────────────────────

export const queryKeys = {
  connectionsSummary: (tenantId: string) =>
    ["connections-summary", tenantId] as const,
  syncHistory: (tenantId: string, limit?: number) =>
    ["sync-history", tenantId, limit] as const,
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useConnectionsSummary(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.connectionsSummary(tenantId),
    queryFn: () =>
      apiClient.get<ConnectionsSummary>(
        "/analytics/connections-summary",
        tenantId
      ),
    staleTime: 30_000,
    refetchInterval: 60_000, // background refresh every minute
  })
}

export function useSyncHistory(tenantId: string, limit = 20) {
  return useQuery({
    queryKey: queryKeys.syncHistory(tenantId, limit),
    queryFn: () =>
      apiClient.get<SyncHistory>(
        `/analytics/sync-history?limit=${limit}`,
        tenantId
      ),
    staleTime: 30_000,
  })
}
