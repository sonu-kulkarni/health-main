"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-background">
      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-20 px-4">
          <button
            onClick={() => router.push("/dashboard/documents")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition ${
              isActive("/dashboard/documents")
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            </svg>
            <span className="text-xs font-medium">Documents</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/qr-code")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition ${
              isActive("/dashboard/qr-code")
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h8V3H3v8zm10 0h8V3h-8v8zM3 21h8v-8H3v8zm10 0h8v-8h-8v8z" />
            </svg>
            <span className="text-xs font-medium">QR Code</span>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition ${
              isActive("/dashboard") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z" />
            </svg>
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition ${
              isActive("/dashboard/profile")
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
