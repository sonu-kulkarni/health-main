"use client"

import type React from "react"

import { useRef, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"

interface DocumentUploadProps {
  userId: string
  onUploadSuccess: () => void
}

export default function DocumentUpload({ userId, onUploadSuccess }: DocumentUploadProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("prescription")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage("File size must be less than 10MB")
        return
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        setMessage("Only PDF, JPG, and PNG files are allowed")
        return
      }

      setSelectedFile(file)
      setMessage("")
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setMessage("Please select a file")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      // Generate unique file path
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("medical-documents").upload(fileName, selectedFile)

      if (uploadError) {
        setMessage("Error uploading file: " + uploadError.message)
        setLoading(false)
        return
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("medical-documents").getPublicUrl(fileName)

      // Save document metadata to database
      const { error: dbError } = await supabase.from("documents").insert({
        user_id: userId,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        file_path: publicUrl,
        document_type: documentType,
      })

      if (dbError) {
        setMessage("Error saving document info: " + dbError.message)
      } else {
        setMessage("Document uploaded successfully!")
        setSelectedFile(null)
        setDocumentType("prescription")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        onUploadSuccess()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      setMessage("An error occurred during upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("Error") || message.includes("only")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="prescription">Prescription</option>
          <option value="lab_report">Lab Report</option>
          <option value="medical_record">Medical Record</option>
          <option value="imaging">Imaging (X-ray, CT, MRI)</option>
          <option value="vaccination">Vaccination Certificate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Select File</label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            disabled={loading}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full" disabled={loading}>
            <svg
              className="w-8 h-8 mx-auto mb-2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-foreground font-medium">
              {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !selectedFile}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg"
      >
        {loading ? "Uploading..." : "Upload Document"}
      </Button>
    </form>
  )
}
