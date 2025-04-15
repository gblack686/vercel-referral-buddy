import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function LandingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Check if there's a code parameter in the URL
  const code = searchParams.code

  // If there's a code, handle the OAuth callback
  if (typeof code === "string") {
    try {
      const supabase = createServerComponentClient({ cookies })

      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
      } else {
        // Redirect to Notion after successful authentication
        redirect("https://www.notion.so/referralbuddy/Referral-Buddy-1049e1785265805aa6d8d1a417766778")
      }
    } catch (error) {
      console.error("Error handling OAuth callback:", error)
    }
  }

  // Regular landing page content if no code is present
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Referral Buddy</h1>
          <p className="text-xl text-muted-foreground max-w-prose mx-auto">
            Your Personal Outbound Assistant with integrations to your favorite apps and campaign templates for job
            seekers, networking and more.
          </p>
          <div className="pt-6 flex gap-4 justify-center">
            <Button size="lg" asChild className="px-8">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-sm text-center text-muted-foreground">
            © {new Date().getFullYear()} Referral Buddy. All rights reserved.
            <Link href="/privacy" className="underline ml-1">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
