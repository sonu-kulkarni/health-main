"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingScreen from "@/components/loading-screen"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Wait for loading screen to finish (3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 3000))

        if (session) {
          // User is logged in, go to dashboard
          router.push("/dashboard")
        } else {
          // User is not logged in, go to sign in
          router.push("/auth/signin")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Default to sign in on error
        router.push("/auth/signin")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
  }, [router, supabase])

  if (isLoading) {
    return <LoadingScreen />
  }

  return null
}
