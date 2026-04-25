import { InboxView } from "./inbox-view"

export default function InboxPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Inbox</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gmail triage with AI-extracted deadlines and action items
        </p>
      </div>
      <InboxView />
    </div>
  )
}
