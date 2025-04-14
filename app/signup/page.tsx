"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)

      // Get the current origin for the redirect URL
      const origin = typeof window !== "undefined" ? window.location.origin : ""

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          scopes: "email profile https://www.googleapis.com/auth/gmail.readonly",
        },
      })

      if (error) {
        console.error("OAuth error:", error)
        throw error
      }

      // Note: The user will be redirected to Google's OAuth page,
      // so we don't need to handle navigation here
    } catch (error) {
      console.error("Error signing up with Google:", error)
      alert("Error signing up with Google. Please try again.")
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = () => {
    router.push("/signup/email")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-muted-foreground">Join Referral Buddy to enhance your outreach</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
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
            {isLoading ? "Signing up..." : "Sign up with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleEmailSignUp}>
            Create Account with Email
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <Link href="/" className="text-sm text-primary hover:underline block mt-2">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
