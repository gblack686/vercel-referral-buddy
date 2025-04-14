"use server"

import { createServerSupabaseClient } from "./supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Store refresh token in database after successful authentication
export async function storeRefreshToken(refreshToken: string) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Store the refresh token in the database
  const { error } = await supabase
    .from("users")
    .update({
      refresh_token: refreshToken,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error storing refresh token:", error)
    throw new Error("Failed to store refresh token")
  }

  return { success: true }
}

// Sign out and revoke token
export async function signOut() {
  const supabase = createServerSupabaseClient()

  try {
    // Get the current user and their refresh token
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Get the refresh token from the database
      const { data: userData } = await supabase.from("users").select("refresh_token").eq("id", user.id).single()

      if (userData?.refresh_token) {
        // Revoke the token using Google's OAuth2 revocation endpoint
        await revokeGoogleToken(userData.refresh_token)

        // Update user status in database
        await supabase
          .from("users")
          .update({
            is_active: false,
            refresh_token: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
      }
    }

    // Sign out from Supabase
    await supabase.auth.signOut()

    // Revalidate the path to update UI
    revalidatePath("/")
    redirect("/")
  } catch (error) {
    console.error("Error during sign out:", error)
    throw new Error("Failed to sign out")
  }
}

// Helper function to revoke Google token
async function revokeGoogleToken(refreshToken: string): Promise<boolean> {
  const revokeEndpoint = "https://oauth2.googleapis.com/revoke"

  try {
    const response = await fetch(revokeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `token=${refreshToken}`,
    })

    if (response.ok) {
      console.log("Token successfully revoked")
      return true
    } else {
      console.error(`Failed to revoke token: ${response.status} - ${await response.text()}`)
      return false
    }
  } catch (error) {
    console.error("Error revoking token:", error)
    return false
  }
}

// Get a fresh access token using the stored refresh token
export async function getFreshAccessToken(userId: string) {
  const supabase = createServerSupabaseClient()

  // Get the refresh token from the database
  const { data: userData, error } = await supabase.from("users").select("refresh_token").eq("id", userId).single()

  if (error || !userData?.refresh_token) {
    throw new Error("Refresh token not found")
  }

  // Exchange refresh token for a new access token
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: userData.refresh_token,
        grant_type: "refresh_token",
      }).toString(),
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`)
    }

    const tokenData = await response.json()
    return tokenData.access_token
  } catch (error) {
    console.error("Error refreshing access token:", error)
    throw new Error("Failed to refresh access token")
  }
}
