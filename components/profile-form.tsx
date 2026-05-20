"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProfileFormProps {
  userId: string
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    blood_type: "",
    gender: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    allergies: "",
    current_medications: "",
    chronic_conditions: "",
    insurance_provider: "",
    insurance_policy_number: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (data) {
        setFormData(data)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        ...formData,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        setMessage("Error saving profile: " + error.message)
      } else {
        setMessage("Profile saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      setMessage("An error occurred while saving")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg text-xs md:text-sm ${
            message.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Full Name</label>
            <Input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Date of Birth</label>
            <Input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Blood Type</label>
            <select
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            >
              <option value="">Select Blood Type</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Phone Number</label>
            <Input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Contact Name</label>
            <Input
              type="text"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Contact Phone</label>
            <Input
              type="tel"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Medical Information Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Medical Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="List any allergies..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Current Medications</label>
            <textarea
              name="current_medications"
              value={formData.current_medications}
              onChange={handleChange}
              placeholder="List current medications..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Chronic Conditions</label>
            <textarea
              name="chronic_conditions"
              value={formData.chronic_conditions}
              onChange={handleChange}
              placeholder="List any chronic conditions..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Insurance Information Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Insurance Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Insurance Provider</label>
            <Input
              type="text"
              name="insurance_provider"
              value={formData.insurance_provider}
              onChange={handleChange}
              placeholder="Insurance Company Name"
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Policy Number</label>
            <Input
              type="text"
              name="insurance_policy_number"
              value={formData.insurance_policy_number}
              onChange={handleChange}
              placeholder="Policy Number"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg text-sm md:text-base"
      >
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
