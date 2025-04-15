import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }

    // Exchange the code for tokens
    const tokens = await exchangeCodeForTokens(code)

    if (!tokens || !tokens.refresh_token) {
      return NextResponse.redirect(new URL("/login?error=token_exchange", request.url))
    }

    // Get the current user from Supabase
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // If no user is logged in, we need to handle this case
      return NextResponse.redirect(new URL("/login?error=no_user", request.url))
    }

    // Store the refresh token in Supabase
    const { error: storeError } = await supabase
      .from("users")
      .update({
        refresh_token: tokens.refresh_token,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (storeError) {
      console.error("Error storing refresh token:", storeError)
      return NextResponse.redirect(new URL("/login?error=store_token", request.url))
    }

    // Redirect to Notion after successful token storage
    return NextResponse.redirect("https://www.notion.so/referralbuddy/Referral-Buddy-1049e1785265805aa6d8d1a417766778")
  } catch (error) {
    console.error("Error in OAuth callback:", error)
    return NextResponse.redirect(new URL("/login?error=callback", request.url))
  }
}

// Function to exchange the authorization code for tokens
async function exchangeCodeForTokens(code: string) {
  const tokenEndpoint = "https://oauth2.googleapis.com/token"

  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/oauth/callback`,
    grant_type: "authorization_code",
  })

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Token exchange error:", errorData)
      throw new Error(`Token exchange failed: ${response.status} ${errorData}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    return null
  }
}
