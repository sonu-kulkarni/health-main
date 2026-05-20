"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoadingScreen() {
  const [showText, setShowText] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show text after 1.5 seconds (logo displays for 1.5 sec)
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 1500)

    // Show loading animation after 2.5 seconds (text displays for 1 sec)
    const loaderTimer = setTimeout(() => {
      setShowLoader(true)
    }, 2500)

    // Redirect to app after 5.5 seconds total (loading animation shows for 3 sec)
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard")
    }, 5500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(loaderTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 to-purple-800 flex flex-col items-center justify-center">
      {/* Logo Container - Always visible first */}
      <div className="mb-8 animate-fade-in">
        <Image
          src="/health-vault-logo.png"
          alt="Health Vault Logo"
          width={120}
          height={120}
          priority
          className="drop-shadow-2xl"
        />
      </div>

      {/* Welcome Text - Shows after 1.5 seconds */}
      {showText && (
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to</h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Health Vault
          </h2>
          <p className="text-purple-200 mt-4 text-sm">Your secure medical records</p>
        </div>
      )}

      {showLoader && (
        <div className="mt-12 flex gap-2 animate-fade-in">
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      )}
    </div>
  )
}
