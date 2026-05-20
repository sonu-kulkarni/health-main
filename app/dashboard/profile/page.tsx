"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import ProfileForm from "@/components/profile-form"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/signin")
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    checkAuth()
  }, [router, supabase])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 md:p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold">Profile Settings</h1>
          <p className="text-primary/70 text-xs md:text-sm truncate">{user?.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6">
          <h2 className="text-lg md:text-xl font-bold text-card-foreground mb-4">Personal Information</h2>
          <ProfileForm userId={user?.id} />
        </div>

        <div className="space-y-3 mt-12 pt-6 border-t border-border">
          <Card className="p-4 bg-card border border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center">
                  {theme === "light" ? (
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 18C8.68 18 6 15.32 6 12s2.68-6 6-6 6 2.68 6 6-2.68 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48l2.12 2.12M5.64 18.36l2.12-2.12m8.48-8.48l2.12-2.12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-card-foreground text-sm md:text-base">Theme</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium text-sm w-full md:w-auto"
              >
                Toggle
              </button>
            </div>
          </Card>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg text-sm md:text-base"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
