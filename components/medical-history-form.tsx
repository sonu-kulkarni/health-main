"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface MedicalHistoryFormProps {
  userId: string
}

interface MedicalRecord {
  id: string
  condition_name: string
  diagnosis_date: string
  description: string
  status: string
}

export default function MedicalHistoryForm({ userId }: MedicalHistoryFormProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [formData, setFormData] = useState({
    condition_name: "",
    diagnosis_date: "",
    description: "",
    status: "active",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchRecords = async () => {
      const { data } = await supabase
        .from("medical_history")
        .select("*")
        .eq("user_id", userId)
        .order("diagnosis_date", { ascending: false })

      if (data) {
        setRecords(data)
      }
    }

    if (userId) {
      fetchRecords()
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
      const { error } = await supabase.from("medical_history").insert({
        user_id: userId,
        ...formData,
      })

      if (error) {
        setMessage("Error adding record: " + error.message)
      } else {
        setMessage("Medical record added successfully!")
        setFormData({
          condition_name: "",
          diagnosis_date: "",
          description: "",
          status: "active",
        })

        // Refresh records
        const { data } = await supabase
          .from("medical_history")
          .select("*")
          .eq("user_id", userId)
          .order("diagnosis_date", { ascending: false })

        if (data) {
          setRecords(data)
        }

        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      setMessage("An error occurred while saving")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      const { error } = await supabase.from("medical_history").delete().eq("id", recordId)

      if (error) {
        setMessage("Error deleting record: " + error.message)
      } else {
        setRecords(records.filter((r) => r.id !== recordId))
        setMessage("Record deleted successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      setMessage("An error occurred while deleting")
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add New Record Form */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="font-semibold text-card-foreground mb-4">Add New Medical Record</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Condition Name</label>
            <Input
              type="text"
              name="condition_name"
              value={formData.condition_name}
              onChange={handleChange}
              placeholder="e.g., Diabetes, Hypertension"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Diagnosis Date</label>
              <Input type="date" name="diagnosis_date" value={formData.diagnosis_date} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details about the condition..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add Record"}
          </Button>
        </form>
      </Card>

      {/* Medical Records List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Your Medical Records</h3>
        {records.length === 0 ? (
          <Card className="p-6 bg-card border border-border text-center">
            <p className="text-muted-foreground">No medical records yet. Add your first record above.</p>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="p-4 bg-card border border-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-card-foreground">{record.condition_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {record.diagnosis_date ? new Date(record.diagnosis_date).toLocaleDateString() : "No date"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      record.status === "active"
                        ? "bg-red-100 text-red-700"
                        : record.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                  <Button
                    onClick={() => handleDelete(record.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {record.description && <p className="text-sm text-foreground">{record.description}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
