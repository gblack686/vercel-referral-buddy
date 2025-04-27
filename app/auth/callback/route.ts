import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      const supabase = createServerComponentClient({ cookies })

      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(new URL("/login?error=auth", request.url))
      }

      // After successful authentication, redirect to the dashboard
      // where the client can fetch the session and store the token if needed.
      const redirectUrl = new URL("/dashboard", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If no code is present, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  } catch (error) {
    console.error("Error in auth callback:", error)
    return NextResponse.redirect(new URL("/login?error=callback", request.url))
  }
}
