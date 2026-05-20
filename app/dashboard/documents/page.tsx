"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import DocumentUpload from "@/components/document-upload"
import { Card } from "@/components/ui/card"

interface Document {
  id: string
  file_name: string
  file_type: string
  file_size: number
  document_type: string
  upload_date: string
  file_path: string
}

export default function DocumentsPage() {
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<Document[]>([])
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
        await fetchDocuments(user.id)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const fetchDocuments = async (userId: string) => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("upload_date", { ascending: false })

    if (data) {
      setDocuments(data)
    }
  }

  const handleDocumentUploaded = () => {
    if (user) {
      fetchDocuments(user.id)
    }
  }

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const { error } = await supabase.from("documents").delete().eq("id", docId)

      if (error) {
        alert("Error deleting document: " + error.message)
      } else {
        setDocuments(documents.filter((d) => d.id !== docId))
      }
    } catch (err) {
      alert("An error occurred while deleting")
    }
  }

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
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 md:p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold">Medical Documents</h1>
          <p className="text-primary/70 text-xs md:text-sm">Upload and manage your medical documents</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Upload Section */}
        <Card className="p-4 md:p-6 bg-card border border-border mb-6">
          <h2 className="text-lg md:text-xl font-bold text-card-foreground mb-4">Upload Document</h2>
          <DocumentUpload userId={user?.id} onUploadSuccess={handleDocumentUploaded} />
        </Card>

        {/* Documents List */}
        <div className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-foreground">Your Documents</h2>
          {documents.length === 0 ? (
            <Card className="p-4 md:p-6 bg-card border border-border text-center">
              <p className="text-sm md:text-base text-muted-foreground">
                No documents uploaded yet. Upload your first document above.
              </p>
            </Card>
          ) : (
            documents.map((doc) => (
              <Card key={doc.id} className="p-3 md:p-4 bg-card border border-border">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
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
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => window.open(doc.file_path, "_blank")}
                      variant="outline"
                      size="sm"
                      className="text-primary hover:text-primary/80 text-xs md:text-sm"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(doc.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 text-xs md:text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
