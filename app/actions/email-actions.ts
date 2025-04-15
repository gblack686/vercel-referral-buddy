"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getFreshAccessToken, sendEmail } from "@/lib/gmail-api"

export async function sendEmailAction(to: string, subject: string, body: string) {
  try {
    // Get the current user from Supabase
    const supabase = createServerActionClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Get the refresh token from the database
    const { data: userData, error } = await supabase.from("users").select("refresh_token").eq("id", user.id).single()

    if (error || !userData?.refresh_token) {
      throw new Error("Refresh token not found")
    }

    // Get a fresh access token
    const accessToken = await getFreshAccessToken(userData.refresh_token)

    // Send the email
    const result = await sendEmail(accessToken, to, subject, body)

    return { success: true, result }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: (error as Error).message }
  }
}
