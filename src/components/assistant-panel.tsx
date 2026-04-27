"use client"

import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api-client"

type Msg = { role: "user" | "assistant"; content: string }

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hey! 👋 I'm your business assistant.\n\nI can help you:\n• Get a summary of what needs action today\n• See your deadlines and urgent emails\n• Organize tasks from your inbox\n• Answer quick questions about your business\n\nWhat do you need help with?",
}

export function AssistantPanel({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const next = [...messages, { role: "user" as const, content: text }]
    setMessages(next)
    setInput("")
    setLoading(true)

    try {
      const apiMessages = next.filter((m) => m !== GREETING)
      const res = await apiClient.post<{ reply: string }>(
        "/assistant/chat",
        tenantId,
        { messages: apiMessages }
      )
      setMessages((m) => [...m, { role: "assistant", content: res.reply }])
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Hmm, I couldn't reach the assistant. Make sure ANTHROPIC_API_KEY is set on the backend.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 hover:shadow-xl"
        aria-label="Toggle assistant"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Slide-in panel */}
      <aside
        className={`fixed right-0 top-0 z-30 flex h-screen w-full max-w-md flex-col border-l border-border bg-white shadow-2xl transition-transform duration-300 dark:bg-card ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Assistant</h2>
            <p className="text-xs text-muted-foreground">Powered by Claude</p>
          </div>
          <button
            onClick={() => setMessages([GREETING])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything…"
              rows={1}
              className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
