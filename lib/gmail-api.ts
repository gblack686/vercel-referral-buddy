// This file should only be used in server components or API routes

// Function to get a fresh access token using the stored refresh token
export async function getFreshAccessToken(refreshToken: string) {
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
        refresh_token: refreshToken,
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

// Function to send an email using the Gmail API
export async function sendEmail(accessToken: string, to: string, subject: string, body: string) {
  try {
    // Create the email content
    const email = [`To: ${to}`, `Subject: ${subject}`, "Content-Type: text/html; charset=utf-8", "", body].join("\r\n")

    // Encode the email in base64
    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // Send the email using the Gmail API
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to send email: ${response.status} ${errorData}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
