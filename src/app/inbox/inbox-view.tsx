"use client"

import { useState } from "react"
import { Calendar, CheckSquare, Building2, ExternalLink, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/formatters"

// ── Types ─────────────────────────────────────────────────────────────────────

type Priority = "Critical" | "High" | "Medium" | "Low"
type Category = "Finance" | "Legal" | "Urgent" | "Deadlines" | "Customer" | "Other"

interface EmailDeadline {
  date: string
  description: string
}

interface ActionItem {
  id: string
  text: string
  done: boolean
}

interface Email {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  body: string
  receivedAt: string
  priority: Priority
  category: Category
  aiSummary: string
  deadlines: EmailDeadline[]
  actionItems: ActionItem[]
  mentionedVendors: string[]
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const EMAILS: Email[] = [
  {
    id: "e1",
    from: "Michael Hartmann",
    fromEmail: "mhartmann@taxfirm.com",
    subject: "RE: Q1 Tax Filing — Action Required by April 25",
    preview: "Please submit your Q1 documents before end of business Friday...",
    body: `Hi,\n\nThis is a reminder that your Q1 tax documents must be submitted no later than April 25, 2025 (end of business).\n\nRequired documents:\n• Payroll summaries (Jan–Mar)\n• Expense receipts over $250\n• Contractor payment records (1099)\n\nPlease log in to the client portal and upload the files, or reply to this email with attachments.\n\nLet me know if you have any questions.\n\nBest,\nMichael Hartmann\nSenior Tax Advisor, Hartmann & Associates`,
    receivedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    priority: "Critical",
    category: "Deadlines",
    aiSummary: "Tax advisor requesting Q1 documents (payroll, expenses, 1099s) by April 25. Hard deadline — late submission incurs penalties.",
    deadlines: [{ date: "Apr 25", description: "Q1 tax documents due to Hartmann & Associates" }],
    actionItems: [
      { id: "a1", text: "Gather payroll summaries (Jan–Mar)", done: false },
      { id: "a2", text: "Collect expense receipts over $250", done: false },
      { id: "a3", text: "Pull contractor payment records (1099)", done: false },
      { id: "a4", text: "Upload to client portal", done: false },
    ],
    mentionedVendors: ["Hartmann & Associates"],
  },
  {
    id: "e2",
    from: "Sandra Walsh",
    fromEmail: "sandra.walsh@acme-contracts.com",
    subject: "Service Agreement Renewal — Expires April 28",
    preview: "Your current service agreement will expire in 3 days. To avoid service interruption...",
    body: `Dear Valued Customer,\n\nYour current service agreement (Contract #A-2023-0891) is set to expire on April 28, 2025.\n\nRenewal options:\n• Standard (1 year) — $18,400/yr, same terms\n• Premium (1 year) — $24,600/yr, SLA upgrade to 99.9%\n• Month-to-month — $1,800/mo, no commitment\n\nTo avoid any disruption to your service, please confirm your preferred option by April 26.\n\nIf we don't hear back, your account will automatically renew at Standard terms.\n\nSandra Walsh\nAccount Manager, Acme Corp`,
    receivedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    priority: "High",
    category: "Deadlines",
    aiSummary: "Acme Corp service contract expires April 28. Three renewal tiers available. Auto-renews at Standard if no response by April 26.",
    deadlines: [
      { date: "Apr 26", description: "Reply to confirm Acme renewal tier" },
      { date: "Apr 28", description: "Acme contract expiry" },
    ],
    actionItems: [
      { id: "b1", text: "Review current Acme contract terms", done: false },
      { id: "b2", text: "Decide on renewal tier (Standard/Premium/M2M)", done: false },
      { id: "b3", text: "Reply to Sandra Walsh by April 26", done: false },
    ],
    mentionedVendors: ["Acme Corp"],
  },
  {
    id: "e3",
    from: "CEO — Internal",
    fromEmail: "ceo@company.internal",
    subject: "May 1 Board Report — Finance Section Due",
    preview: "The board deck for the May 1 meeting needs the finance section by Friday COB...",
    body: `Team,\n\nThe board meeting is May 1. I need all section leads to submit their portions of the board report by Friday, April 25, COB.\n\nFor Finance:\n• Revenue summary (Apr vs. Mar and vs. budget)\n• Cash flow statement\n• Updated burn rate\n• Key risks\n\nSlide template is in the shared Google Drive: /Board Decks/2025-Q1/\n\nThis is a hard deadline — the deck goes to print on Saturday morning.\n\nThanks`,
    receivedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    priority: "High",
    category: "Deadlines",
    aiSummary: "Internal request: finance section of May 1 board deck due Friday April 25 COB. Requires revenue summary, cash flow, burn rate, risks.",
    deadlines: [{ date: "Apr 25", description: "Finance section for board deck (COB)" }],
    actionItems: [
      { id: "c1", text: "Prepare Apr vs. Mar revenue comparison", done: false },
      { id: "c2", text: "Update cash flow statement", done: false },
      { id: "c3", text: "Calculate updated burn rate", done: false },
      { id: "c4", text: "Submit to board deck folder", done: false },
    ],
    mentionedVendors: [],
  },
  {
    id: "e4",
    from: "Chase Business",
    fromEmail: "no-reply@notifications.chase.com",
    subject: "Large Transaction Alert — $12,400 outgoing",
    preview: "A transaction of $12,400 was processed on your business account ending in 4821...",
    body: `Business Alert\n\nTransaction Details:\nAmount: $12,400.00\nType: ACH Debit\nMerchant: INITECH SOLUTIONS LLC\nAccount: ...4821\nDate: April 24, 2025\nReference: ACH-20250424-887312\n\nIf you did not authorize this transaction, please contact us immediately at 1-800-935-9935.\n\nChase Business Banking`,
    receivedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    priority: "High",
    category: "Finance",
    aiSummary: "Chase business account alert: $12,400 ACH debit to Initech Solutions LLC. Verify this matches expected payment for Initech proposal.",
    deadlines: [],
    actionItems: [
      { id: "d1", text: "Verify $12,400 ACH to Initech Solutions is authorized", done: true },
      { id: "d2", text: "Reconcile in accounting system", done: false },
    ],
    mentionedVendors: ["Initech Solutions LLC", "Chase Business"],
  },
  {
    id: "e5",
    from: "Stripe",
    fromEmail: "support@stripe.com",
    subject: "Your payout of $28,400 is on its way",
    preview: "A payout of $28,400.00 has been initiated to your bank account...",
    body: `Your Stripe payout has been initiated.\n\nAmount: $28,400.00\nEstimated arrival: April 25, 2025\nDestination: JPMorgan Chase ...4821\n\nThis payout covers charges from April 17 – April 23, 2025.\n\nView details in your Stripe Dashboard → Payouts\n\nStripe`,
    receivedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    priority: "Medium",
    category: "Finance",
    aiSummary: "Stripe payout of $28,400 arriving April 25 for charges from April 17–23.",
    deadlines: [],
    actionItems: [{ id: "e1", text: "Confirm payout receipt on April 25", done: false }],
    mentionedVendors: ["Stripe"],
  },
  {
    id: "e6",
    from: "DataFlow Ltd",
    fromEmail: "mark.davis@dataflow.io",
    subject: "RE: Proposal feedback + questions",
    preview: "Thanks for sending over the proposal. We have a few questions before we can move forward...",
    body: `Hi,\n\nThanks for the proposal. Overall it looks good. A few questions:\n\n1. Can you include a dedicated CSM in the Enterprise tier?\n2. What's the minimum contract term?\n3. Is the onboarding timeline negotiable (we need to go live by June 1)?\n\nIf we can get answers by end of week, we can present to our board on Friday.\n\nMark Davis\nCTO, DataFlow Ltd`,
    receivedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    priority: "High",
    category: "Customer",
    aiSummary: "Prospect DataFlow asking 3 clarifying questions about proposal. Board presentation Friday — need response by end of week to close.",
    deadlines: [{ date: "Apr 25", description: "Reply to DataFlow proposal questions" }],
    actionItems: [
      { id: "f1", text: "Confirm if CSM is included in Enterprise tier", done: false },
      { id: "f2", text: "Check minimum contract terms with legal", done: false },
      { id: "f3", text: "Reply to Mark Davis with answers", done: false },
    ],
    mentionedVendors: ["DataFlow Ltd"],
  },
]

const CATEGORIES: { name: Category; color: string }[] = [
  { name: "Finance", color: "text-blue-600 dark:text-blue-400" },
  { name: "Legal", color: "text-purple-600 dark:text-purple-400" },
  { name: "Urgent", color: "text-red-600 dark:text-red-400" },
  { name: "Deadlines", color: "text-amber-600 dark:text-amber-400" },
  { name: "Customer", color: "text-emerald-600 dark:text-emerald-400" },
  { name: "Other", color: "text-muted-foreground" },
]

const PRIORITY_VARIANT = {
  Critical: "danger",
  High: "warning",
  Medium: "secondary",
  Low: "outline",
} as const

// ── Component ─────────────────────────────────────────────────────────────────

export function InboxView() {
  const [activeCategory, setActiveCategory] = useState<Category>("Deadlines")
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    EMAILS.filter((e) => e.category === "Deadlines")[0]?.id ?? EMAILS[0].id
  )
  const [actionItems, setActionItems] = useState<Record<string, boolean>>(
    Object.fromEntries(
      EMAILS.flatMap((e) => e.actionItems.map((a) => [a.id, a.done]))
    )
  )

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map(({ name }) => [name, EMAILS.filter((e) => e.category === name).length])
  )

  const filteredEmails = EMAILS.filter((e) => e.category === activeCategory)
  const selectedEmail = EMAILS.find((e) => e.id === selectedEmailId) ?? filteredEmails[0]

  function toggleAction(id: string) {
    setActionItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] gap-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
      {/* ── Left: category + email list ────────────────────────────────────── */}
      <div className="flex w-64 shrink-0 flex-col border-r border-border">
        <div className="border-b border-border px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Priority Queue
          </p>
        </div>

        {/* Category filters */}
        <div className="border-b border-border px-2 py-2">
          {CATEGORIES.map(({ name, color }) => (
            <button
              key={name}
              onClick={() => {
                setActiveCategory(name)
                const first = EMAILS.find((e) => e.category === name)
                if (first) setSelectedEmailId(first.id)
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                activeCategory === name
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className={activeCategory === name ? "text-primary" : color}>
                {name}
              </span>
              {categoryCounts[name] > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0 text-[10px] font-semibold",
                    activeCategory === name
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {categoryCounts[name]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No emails in this category
            </div>
          ) : (
            filteredEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={cn(
                  "w-full border-b border-border px-3 py-3 text-left transition-colors",
                  selectedEmailId === email.id
                    ? "bg-primary/5"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {email.from}
                  </span>
                  <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                    {formatRelativeTime(email.receivedAt)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                  {email.subject}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {email.preview}
                </p>
                <div className="mt-1.5">
                  <Badge
                    variant={PRIORITY_VARIANT[email.priority]}
                    className="text-[9px] px-1 py-0"
                  >
                    {email.priority}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Middle: email body ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 border-r border-border">
        {selectedEmail ? (
          <>
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground leading-snug">
                    {selectedEmail.subject}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{selectedEmail.from}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span>{selectedEmail.fromEmail}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span>{formatRelativeTime(selectedEmail.receivedAt)}</span>
                  </div>
                </div>
                <Badge variant={PRIORITY_VARIANT[selectedEmail.priority]}>
                  {selectedEmail.priority}
                </Badge>
              </div>

              {/* AI summary */}
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2.5">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="font-semibold text-primary">AI: </span>
                  {selectedEmail.aiSummary}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {selectedEmail.body}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Select an email to preview</p>
          </div>
        )}
      </div>

      {/* ── Right: AI-extracted actions ─────────────────────────────────────── */}
      <div className="w-64 shrink-0 overflow-y-auto">
        {selectedEmail ? (
          <div className="p-4 space-y-5">
            {/* Deadlines */}
            {selectedEmail.deadlines.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                  <p className="text-xs font-semibold text-foreground">Deadlines</p>
                </div>
                <div className="space-y-2">
                  {selectedEmail.deadlines.map((d) => (
                    <div key={d.description} className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800 dark:bg-amber-950/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                          {d.date}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1 px-1.5 text-[10px] text-amber-700 hover:bg-amber-100 dark:text-amber-400"
                          aria-label="Add to calendar"
                        >
                          <Calendar className="h-3 w-3" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-snug">
                        {d.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action items */}
            {selectedEmail.actionItems.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <p className="text-xs font-semibold text-foreground">Action Items</p>
                </div>
                <div className="space-y-1.5">
                  {selectedEmail.actionItems.map((item) => {
                    const done = actionItems[item.id] ?? item.done
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleAction(item.id)}
                        className="flex w-full items-start gap-2 rounded-md px-1 py-1 text-left hover:bg-muted/50 transition-colors"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                            done
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}
                          aria-hidden="true"
                        >
                          {done && (
                            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-white">
                              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-xs leading-snug transition-colors",
                            done ? "text-muted-foreground line-through" : "text-foreground"
                          )}
                        >
                          {item.text}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Mentioned vendors */}
            {selectedEmail.mentionedVendors.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <p className="text-xs font-semibold text-foreground">Mentioned</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmail.mentionedVendors.map((v) => (
                    <span
                      key={v}
                      className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* View in Gmail */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-xs"
              aria-label="Open in Gmail"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Open in Gmail
            </Button>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-center text-xs text-muted-foreground">
              Select an email to see AI-extracted actions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
