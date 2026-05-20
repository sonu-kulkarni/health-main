"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

interface Document {
  id: string
  file_name: string
  file_type: string
  file_size: number
  document_type: string
  upload_date: string
  file_path: string
}

export default function ViewRecordsPage() {
  const params = useParams()
  const token = params.token as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        console.log("[v0] Token received:", token)

        // Look up the QR code record to get the user_id
        const { data: qrRecord, error: qrError } = await supabase
          .from("qr_codes")
          .select("user_id")
          .eq("qr_code_data", `${window.location.origin}/view-records/${token}`)
          .eq("is_active", true)
          .single()

        if (qrError || !qrRecord) {
          console.log("[v0] QR code lookup error:", qrError)
          setError("Invalid or expired QR code")
          setLoading(false)
          return
        }

        const userId = qrRecord.user_id
        console.log("[v0] Fetching records for user:", userId)

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single()

        if (profileError) {
          console.log("[v0] Profile fetch error:", profileError)
        } else {
          console.log("[v0] Profile data:", profileData)
          setProfile(profileData)
        }

        // Fetch medical history
        const { data: historyData, error: historyError } = await supabase
          .from("medical_history")
          .select("*")
          .eq("user_id", userId)
          .order("diagnosis_date", { ascending: false })

        if (historyError) {
          console.log("[v0] Medical history fetch error:", historyError)
        } else {
          console.log("[v0] Medical history data:", historyData)
          setMedicalHistory(historyData || [])
        }

        // Fetch documents
        const { data: docsData, error: docsError } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", userId)
          .order("upload_date", { ascending: false })

        if (docsError) {
          console.log("[v0] Documents fetch error:", docsError)
        } else {
          console.log("[v0] Documents data:", docsData)
          setDocuments(docsData || [])
        }

        if (!profileData && (!historyData || historyData.length === 0) && (!docsData || docsData.length === 0)) {
          setError("No records found for this QR code")
        }
      } catch (err) {
        console.log("[v0] Error loading records:", err)
        setError("Error loading records")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchRecords()
    }
  }, [token, supabase])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground text-sm md:text-base">Loading medical records...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 bg-card border border-border max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-card-foreground mb-2">Unable to Load Records</h1>
          <p className="text-muted-foreground text-xs md:text-sm">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 md:p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold">Medical Records</h1>
          <p className="text-blue-100 text-xs md:text-sm">Shared via Health Vault QR Code</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("medical")}
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
              activeTab === "medical"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Medical History
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
              activeTab === "documents"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Documents
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && profile && (
          <div className="space-y-4">
            <Card className="p-4 md:p-6 bg-card border border-border">
              <h2 className="text-base md:text-lg font-bold text-card-foreground mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">
                    {profile.full_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">
                    {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blood Type</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">
                    {profile.blood_type || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">
                    {profile.gender || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">
                    {profile.phone_number || "Not provided"}
                  </p>
                </div>
              </div>
            </Card>

            {profile.emergency_contact_name && (
              <Card className="p-4 md:p-6 bg-card border border-border">
                <h2 className="text-base md:text-lg font-bold text-card-foreground mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Name</p>
                    <p className="font-semibold text-foreground text-sm md:text-base">
                      {profile.emergency_contact_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Phone</p>
                    <p className="font-semibold text-foreground text-sm md:text-base">
                      {profile.emergency_contact_phone}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {(profile.allergies || profile.current_medications || profile.chronic_conditions) && (
              <Card className="p-4 md:p-6 bg-card border border-border">
                <h2 className="text-base md:text-lg font-bold text-card-foreground mb-4">Medical Information</h2>
                <div className="space-y-4">
                  {profile.allergies && (
                    <div>
                      <p className="text-xs text-muted-foreground">Allergies</p>
                      <p className="font-semibold text-foreground text-sm md:text-base">{profile.allergies}</p>
                    </div>
                  )}
                  {profile.current_medications && (
                    <div>
                      <p className="text-xs text-muted-foreground">Current Medications</p>
                      <p className="font-semibold text-foreground text-sm md:text-base">
                        {profile.current_medications}
                      </p>
                    </div>
                  )}
                  {profile.chronic_conditions && (
                    <div>
                      <p className="text-xs text-muted-foreground">Chronic Conditions</p>
                      <p className="font-semibold text-foreground text-sm md:text-base">{profile.chronic_conditions}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {(profile.insurance_provider || profile.insurance_policy_number) && (
              <Card className="p-4 md:p-6 bg-card border border-border">
                <h2 className="text-base md:text-lg font-bold text-card-foreground mb-4">Insurance Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.insurance_provider && (
                    <div>
                      <p className="text-xs text-muted-foreground">Insurance Provider</p>
                      <p className="font-semibold text-foreground text-sm md:text-base">{profile.insurance_provider}</p>
                    </div>
                  )}
                  {profile.insurance_policy_number && (
                    <div>
                      <p className="text-xs text-muted-foreground">Policy Number</p>
                      <p className="font-semibold text-foreground text-sm md:text-base">
                        {profile.insurance_policy_number}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === "medical" && (
          <div className="space-y-3">
            {medicalHistory.length === 0 ? (
              <Card className="p-4 md:p-6 bg-card border border-border text-center">
                <p className="text-sm md:text-base text-muted-foreground">No medical history records available</p>
              </Card>
            ) : (
              medicalHistory.map((record) => (
                <Card key={record.id} className="p-3 md:p-4 bg-card border border-border">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground text-sm md:text-base">
                        {record.condition_name}
                      </h4>
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
                  {record.description && <p className="text-xs md:text-sm text-foreground">{record.description}</p>}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-3">
            {documents.length === 0 ? (
              <Card className="p-4 md:p-6 bg-card border border-border text-center">
                <p className="text-sm md:text-base text-muted-foreground">No documents available</p>
              </Card>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id} className="p-3 md:p-4 bg-card border border-border">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-card-foreground truncate text-sm md:text-base">
                            {doc.file_name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {doc.document_type} • {formatFileSize(doc.file_size)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => window.open(doc.file_path, "_blank")}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 text-xs md:text-sm flex-shrink-0"
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
