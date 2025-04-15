"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { getGoogleOAuthURL } from "@/lib/google-oauth"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  // Check for error parameters in the URL
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        no_code: "No authorization code received from Google.",
        token_exchange: "Failed to exchange authorization code for tokens.",
        no_user: "No user found. Please sign up first.",
        store_token: "Failed to store the refresh token.",
        callback: "An error occurred during the OAuth callback.",
      }

      setError(errorMessages[errorParam] || "An error occurred during authentication.")
    }
  }, [searchParams])

  // First, handle Supabase authentication
  const handleSupabaseLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/connect-gmail`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error logging in with Supabase:", error)
      setError(error.message || "Failed to login with Google.")
      setIsLoading(false)
    }
  }

  // Direct Google OAuth for Gmail access
  const handleGmailConnect = () => {
    window.location.href = getGoogleOAuthURL()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Sign in to your Referral Buddy account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">{error}</div>
          )}

          <Button
            variant="outline"
            onClick={handleSupabaseLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-google"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
