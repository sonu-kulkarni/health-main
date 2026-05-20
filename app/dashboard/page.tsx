"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Card } from "@/components/ui/card"

interface UserProfile {
  full_name: string
  date_of_birth: string
  blood_type: string
  gender: string
  phone_number: string
  emergency_contact_name: string
  emergency_contact_phone: string
  allergies: string
  current_medications: string
  chronic_conditions: string
  insurance_provider: string
  insurance_policy_number: string
}

interface MedicalRecord {
  id: string
  condition_name: string
  diagnosis_date: string
  description: string
  status: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([])
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
        // Fetch profile data
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        if (profileData) {
          setProfile(profileData)
        }

        // Fetch medical history
        const { data: historyData } = await supabase
          .from("medical_history")
          .select("*")
          .eq("user_id", user.id)
          .order("diagnosis_date", { ascending: false })

        if (historyData) {
          setMedicalHistory(historyData)
        }
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

  if (!profile || !profile.full_name) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        <div className="bg-gradient-to-r from-primary to-accent text-white p-4 md:p-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold">Health Vault</h1>
            <p className="text-primary/70 text-xs md:text-sm truncate">{user?.email}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Card className="p-8 md:p-12 bg-card border border-border text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-card-foreground mb-2">No Profile Data Yet</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              Start by filling out your profile information to get started with Health Vault.
            </p>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-2 px-6 rounded-lg text-sm md:text-base w-full md:w-auto"
            >
              Go to Profile
            </button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 md:p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold">Health Vault</h1>
          <p className="text-primary/70 text-xs md:text-sm truncate">{user?.email}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile Overview */}
        <Card className="p-4 md:p-6 bg-card border border-border mb-6">
          <h2 className="text-lg md:text-xl font-bold text-card-foreground mb-4">Profile Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-semibold text-foreground text-sm md:text-base">{profile.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="font-semibold text-foreground text-sm md:text-base">
                {profile.blood_type || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-semibold text-foreground text-sm md:text-base">
                {profile.phone_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="font-semibold text-foreground text-sm md:text-base">{profile.gender || "Not provided"}</p>
            </div>
          </div>
        </Card>

        {/* Medical History Overview */}
        {medicalHistory.length > 0 && (
          <Card className="p-4 md:p-6 bg-card border border-border">
            <h2 className="text-lg md:text-xl font-bold text-card-foreground mb-4">Recent Medical History</h2>
            <div className="space-y-3">
              {medicalHistory.slice(0, 3).map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border last:border-b-0 gap-2"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground text-sm md:text-base">{record.condition_name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {record.diagnosis_date ? new Date(record.diagnosis_date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      record.status === "active"
                        ? "bg-red-100 text-red-700"
                        : record.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
