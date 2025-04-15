"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getGoogleOAuthURL } from "@/lib/google-oauth"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ConnectGmail() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      setIsLoading(false)
    }

    checkUser()
  }, [router, supabase])

  const handleConnectGmail = () => {
    setIsConnecting(true)
    window.location.href = getGoogleOAuthURL()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connect Gmail</CardTitle>
          <CardDescription className="text-center">
            Connect your Gmail account to enable Referral Buddy features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm mb-4">
            <p className="font-medium">Why connect Gmail?</p>
            <p className="mt-1">
              Referral Buddy needs access to your Gmail to send personalized outreach emails on your behalf. We only
              request the permissions needed for this functionality.
            </p>
          </div>

          <Button
            onClick={handleConnectGmail}
            disabled={isConnecting}
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
              className="lucide lucide-mail"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {isConnecting ? "Connecting..." : "Connect Gmail"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Skip for now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
