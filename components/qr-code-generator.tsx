"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface QRCodeGeneratorProps {
  userId: string
  userEmail: string
}

export default function QRCodeGenerator({ userId, userEmail }: QRCodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchOrGenerateQR = async () => {
      // Check if QR code already exists
      const { data: existingQR } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single()

      if (existingQR) {
        setShareUrl(existingQR.qr_code_data)
        generateQRImage(existingQR.qr_code_data)
      }
    }

    if (userId) {
      fetchOrGenerateQR()
    }
  }, [userId, supabase])

  const generateQRImage = async (url: string) => {
    try {
      // Use QR code API to generate QR code image
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
      setQrCode(qrImageUrl)
    } catch (err) {
      console.error("Error generating QR image:", err)
    }
  }

  const handleGenerateQR = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Create share URL with UUID token
      const baseUrl = window.location.origin
      const shareToken = crypto.randomUUID() // Use proper UUID instead of userId-timestamp
      const fullShareUrl = `${baseUrl}/view-records/${shareToken}`

      // Save QR code to database with the token
      const { error } = await supabase.from("qr_codes").insert({
        user_id: userId,
        qr_code_data: fullShareUrl,
        is_active: true,
      })

      if (error) {
        setMessage("Error generating QR code: " + error.message)
      } else {
        setShareUrl(fullShareUrl)
        await generateQRImage(fullShareUrl)
        setMessage("QR code generated successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      setMessage("An error occurred while generating QR code")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCode) return

    const link = document.createElement("a")
    link.href = qrCode
    link.download = `health-vault-qr-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setMessage("Link copied to clipboard!")
      setTimeout(() => setMessage(""), 2000)
    }
  }

  const handleShareQR = async () => {
    if (!shareUrl || !qrCode) return

    if (navigator.share) {
      try {
        // Fetch the QR code image as a blob
        const response = await fetch(qrCode)
        const blob = await response.blob()
        const file = new File([blob], "health-vault-qr.png", { type: "image/png" })

        await navigator.share({
          title: "Health Vault QR Code",
          text: "Scan this QR code to view my medical records",
          files: [file],
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback: copy link
      handleCopyLink()
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

      <div className="text-center">
        <h2 className="text-xl font-bold text-card-foreground mb-2">Your Medical Records QR Code</h2>
        <p className="text-sm text-muted-foreground">
          Generate a QR code to share your medical records with healthcare providers
        </p>
      </div>

      {qrCode ? (
        <div className="space-y-4">
          {/* QR Code Display */}
          <Card className="p-6 bg-white border border-border flex flex-col items-center">
            <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64 rounded-lg shadow-lg" />
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Scan with Google Lens or any QR code scanner
            </p>
          </Card>

          {/* Share URL */}
          <Card className="p-4 bg-muted border border-border">
            <p className="text-xs text-muted-foreground mb-2">Share Link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl || ""}
                readOnly
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline" size="sm">
                Copy
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadQR}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg"
            >
              Download QR
            </Button>
            <Button
              onClick={handleShareQR}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              Share
            </Button>
          </div>

          {/* Regenerate Button */}
          <Button
            onClick={handleGenerateQR}
            variant="outline"
            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            Generate New QR Code
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleGenerateQR}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? "Generating..." : "Generate QR Code"}
        </Button>
      )}
    </div>
  )
}
