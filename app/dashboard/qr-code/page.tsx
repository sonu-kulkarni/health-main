"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import QRCodeGenerator from "@/components/qr-code-generator"
import { Card } from "@/components/ui/card"

export default function QRCodePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

    checkAuth()
  }, [router, supabase])

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
          <h1 className="text-xl md:text-2xl font-bold">QR Code</h1>
          <p className="text-primary/70 text-xs md:text-sm">Share your medical records securely</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card className="p-4 md:p-6 bg-card border border-border">
          <QRCodeGenerator userId={user?.id} userEmail={user?.email} />
        </Card>

        <Card className="p-4 md:p-6 bg-card border border-border mt-6">
          <h2 className="text-base md:text-lg font-bold text-card-foreground mb-4">How to Use</h2>
          <ul className="space-y-3 text-xs md:text-sm text-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">1.</span>
              <span>Generate your unique QR code from this page</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">2.</span>
              <span>Share the QR code with healthcare providers or emergency contacts</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">3.</span>
              <span>Anyone can scan it with Google Lens or a QR code scanner to view your medical records</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">4.</span>
              <span>Your data is secure and only accessible through the QR code link</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
