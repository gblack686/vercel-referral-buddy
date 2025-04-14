"use client"

import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [supabase])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
            <p className="mb-4">
              You're successfully logged in with Google OAuth. Your refresh token is securely stored and will be used
              for background tasks.
            </p>
            <Button onClick={handleSignOut} variant="destructive" disabled={isLoading}>
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Referral Buddy</h2>
          <p className="mb-4">
            This is where your personal outbound assistant features would appear. You can manage your campaigns,
            integrations, and templates here.
          </p>
        </div>
      </div>
    </div>
  )
}
