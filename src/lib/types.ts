export type ServiceName = "gmail" | "stripe" | "hubspot"
export type ConnectionStatus = "active" | "pending" | "revoked" | "error"
export type SyncRunStatus = "running" | "success" | "partial" | "error"

export interface Connection {
  id: string
  service: ServiceName
  status: ConnectionStatus
  last_synced_at: string | null
  created_at: string | null
  scope: string
  sync_metadata: Record<string, unknown>
  webhook_metadata: Record<string, unknown>
}

export interface ConnectionStats {
  connection_id: string
  service: ServiceName
  status: ConnectionStatus
  last_synced_at: string | null
  created_at: string
  total_records_synced: number
  total_sync_runs: number
  last_error: string | null
}

export interface ConnectionsSummary {
  connections: ConnectionStats[]
  count: number
}

export interface SyncRunRecord {
  id: string
  connection_id: string
  service: ServiceName
  started_at: string
  finished_at: string | null
  status: SyncRunStatus
  records_synced: number
  error_message: string | null
}

export interface SyncHistory {
  runs: SyncRunRecord[]
}

export interface KpiData {
  value: number
  previousValue: number
  delta: number
  deltaPercent: number
  sparkline: number[]
}

export interface RevenuePoint {
  month: string
  saas: number
  services: number
  other: number
}

export interface ChannelData {
  name: string
  value: number
  color: string
}

export interface Deadline {
  id: string
  dueDate: string
  title: string
  priority: "Critical" | "High" | "Medium" | "Low"
  sourceEmailId?: string
}

export interface TopCustomer {
  id: string
  name: string
  revenue: number
  lastActivity: string | null
}

// ── Inbox / Gmail-derived ────────────────────────────────────────────────────

export type EmailPriority = "Critical" | "High" | "Medium" | "Low"
export type EmailCategory = "Finance" | "Legal" | "Urgent" | "Deadlines" | "Customer" | "Other"

export interface InboxEmailDeadline {
  date: string
  description: string
}

export interface InboxActionItem {
  id: string
  text: string
  done: boolean
}

export interface InboxEmail {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  body: string
  receivedAt: string
  priority: EmailPriority
  category: EmailCategory
  aiSummary: string
  deadlines: InboxEmailDeadline[]
  actionItems: InboxActionItem[]
  mentionedVendors: string[]
}

export interface InboxResponse {
  messages: InboxEmail[]
  connected: boolean
}

export interface DeadlineRow {
  date: string
  description: string
  priority: EmailPriority
  source_email_id: string
  source_subject: string
}

export interface DeadlinesResponse {
  deadlines: DeadlineRow[]
}

export interface EmailKpiResponse {
  unread_important: number
  total: number
}

// ── Stripe / Revenue ─────────────────────────────────────────────────────────

export interface RevenueResponse {
  total_revenue: number
  currency: string
  period: string
  transaction_count: number
  change_percent: number
  connected: boolean
  error: string | null
}
