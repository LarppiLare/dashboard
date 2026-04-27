"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "./api-client"
import type { ConnectionsSummary, SyncHistory, InboxResponse, DeadlinesResponse, EmailKpiResponse, RevenueResponse } from "./types"

// ── Key factories ──────────────────────────────────────────────────────────────

export const queryKeys = {
  connectionsSummary: (tenantId: string) =>
    ["connections-summary", tenantId] as const,
  syncHistory: (tenantId: string, limit?: number) =>
    ["sync-history", tenantId, limit] as const,
  inboxMessages: (tenantId: string) => ["inbox-messages", tenantId] as const,
  deadlines: (tenantId: string) => ["deadlines", tenantId] as const,
  emailKpi: (tenantId: string) => ["email-kpi", tenantId] as const,
  revenue: (tenantId: string) => ["revenue", tenantId] as const,
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

export function useInboxMessages(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.inboxMessages(tenantId),
    queryFn: () =>
      apiClient.get<InboxResponse>("/inbox/messages", tenantId),
    staleTime: 30_000,
    refetchInterval: 90_000,
  })
}

export function useDeadlines(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.deadlines(tenantId),
    queryFn: () =>
      apiClient.get<DeadlinesResponse>("/analytics/deadlines", tenantId),
    staleTime: 30_000,
  })
}

export function useEmailKpi(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.emailKpi(tenantId),
    queryFn: () =>
      apiClient.get<EmailKpiResponse>("/analytics/email-kpi", tenantId),
    staleTime: 30_000,
  })
}

export function useRevenue(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.revenue(tenantId),
    queryFn: () =>
      apiClient.get<RevenueResponse>("/analytics/revenue", tenantId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
