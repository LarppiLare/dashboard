"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Inbox,
  CreditCard,
  Megaphone,
  Plug,
  Settings,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/costs", label: "Costs", icon: CreditCard },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/integrations", label: "Integrations", icon: Plug },
]

export function NavRail() {
  const pathname = usePathname()

  return (
    <nav
      className="flex h-screen w-[220px] shrink-0 flex-col border-r border-border bg-white dark:bg-card"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <Zap className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          IntegrateHQ
        </span>
      </div>

      {/* Main nav items */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>

      {/* Settings pinned at bottom */}
      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            pathname === "/settings"
              ? "bg-primary/10 text-primary dark:bg-primary/20"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          aria-current={pathname === "/settings" ? "page" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          Settings
        </Link>
      </div>
    </nav>
  )
}
