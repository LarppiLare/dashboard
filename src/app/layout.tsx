import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { PeriodProvider } from "@/contexts/period-context"
import { NavRail } from "@/components/nav/nav-rail"
import { PeriodSelector } from "@/components/period-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { AssistantPanel } from "@/components/assistant-panel"
import { getCurrentTenant } from "@/lib/auth"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dashboard — IntegrateHQ",
  description: "Multi-tenant integration dashboard",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getCurrentTenant()
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Prevent dark mode flash — runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans">
        <Providers>
          <PeriodProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Persistent left nav rail */}
              <NavRail />

              {/* Main content column */}
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top header bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6 dark:bg-card">
                  <p className="text-sm text-muted-foreground">
                    Tenant:{" "}
                    <span className="font-medium text-foreground">Demo Company</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <PeriodSelector />
                  </div>
                </header>

                {/* Scrollable page content */}
                <main
                  id="main-content"
                  className="flex-1 overflow-y-auto bg-page p-6"
                  tabIndex={-1}
                >
                  {children}
                </main>
              </div>
            </div>
            <AssistantPanel tenantId={tenant.id} />
          </PeriodProvider>
        </Providers>
      </body>
    </html>
  )
}
