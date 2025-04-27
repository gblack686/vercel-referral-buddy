"use client"

import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase-client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// Define the type for the user state more accurately if possible
// Example: import { User } from "@supabase/supabase-js"; (if you use User type)
type User = any; // Replace 'any' with a more specific type if available

export default function Dashboard() {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true) // Start loading until user is fetched
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<"idle" | "checking" | "stored" | "not_found" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()
  const router = useRouter()

  // Function to call the Edge Function
  const storeGmailToken = useCallback(async (refreshToken: string, accessToken: string) => {
    setTokenStatus("checking");
    setError(null);
    console.log("Attempting to store Gmail refresh token...");

    try {
      const response = await fetch(
        // Construct the Edge Function URL using environment variable if possible
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/store-google-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Pass the user's Supabase JWT for authentication
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Error response from edge function:", result);
        throw new Error(result.error || `Failed to store token (${response.status})`);
      }

      console.log("Token stored successfully via Edge Function:", result);
      setTokenStatus("stored");

    } catch (err: any) {
      console.error("Error calling store-google-token function:", err);
      setError(`Failed to store token: ${err.message}`);
      setTokenStatus("error");
    }
  }, [supabase]); // supabase dependency might not be strictly needed if URL is env var

  useEffect(() => {
    const fetchUserAndCheckToken = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors on load

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setError("Could not retrieve user session.");
        setIsLoading(false);
        // Optionally redirect to login if session is critical
        // router.push("/login");
        return;
      }

      if (session?.user) {
        setUser(session.user);
        console.log("User session found:", session.user.id);

        // Check for provider refresh token ONLY if we haven't already processed it
        // We rely on the presence of provider_refresh_token which usually only exists
        // immediately after an OAuth login that granted offline access.
        if (tokenStatus === "idle" && session.provider_refresh_token) {
          console.log("Provider refresh token found in session.");
          // We also need the access token (JWT) to authenticate the edge function call
          if (session.access_token) {
             await storeGmailToken(session.provider_refresh_token, session.access_token);
             // TODO: Potentially clear the provider_refresh_token from the session
             // object client-side if possible/desired, though it's not persisted anyway.
             // Be careful not to mutate the session object directly in ways that
             // might interfere with Supabase's internal state management.
          } else {
              console.warn("Access token not found in session, cannot call edge function securely.");
              setError("Could not verify session to store token.");
              setTokenStatus("error");
          }
        } else if (tokenStatus === "idle") {
          console.log("No provider refresh token found in session, or already processed.");
          // This is normal if the user logged in previously without the token,
          // or if this isn't the immediate redirect after Google Auth.
          setTokenStatus("not_found"); // Indicate we checked and didn't find one *this time*
        }
      } else {
        console.log("No active user session found.");
        // Redirect to login if no user is found
        router.push("/login");
        return; // Stop execution if no user
      }
      setIsLoading(false);
    };

    fetchUserAndCheckToken();
    // Run only once on component mount. Add dependencies if needed,
    // but be careful of infinite loops (e.g., don't add storeGmailToken directly if not wrapped in useCallback)
  }, [supabase, router, storeGmailToken, tokenStatus]); // Added storeGmailToken and tokenStatus

  const handleSignOut = async () => {
    setSignOutLoading(true)
    try {
      await supabase.auth.signOut()
      // Redirect to home or login page after sign out
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      setError("Failed to sign out.");
    } finally {
      setSignOutLoading(false)
    }
  }

  // Render Loading State
  if (isLoading) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
         <p>Loading dashboard...</p>
       </div>
    )
  }

  // Render based on user presence (should always have user by now unless error/redirect occurred)
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Display any errors */}
        {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
             <strong className="font-bold">Error:</strong>
             <span className="block sm:inline"> {error}</span>
           </div>
         )}

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
            <p className="mb-2">
              You're successfully logged in.
            </p>
            {/* Display token status */}
            <div className="mb-4 text-sm">
              {tokenStatus === 'checking' && <p className="text-blue-600">Checking Gmail connection...</p>}
              {tokenStatus === 'stored' && <p className="text-green-600">Gmail refresh token securely stored.</p>}
              {tokenStatus === 'not_found' && <p className="text-gray-600">Gmail connection status: Not connected (or token already processed).</p>}
              {tokenStatus === 'error' && <p className="text-red-600">Could not store Gmail token.</p>}
              {/* Consider adding a button here to re-attempt connection if status is 'not_found' or 'error' */}
            </div>
            <Button onClick={handleSignOut} variant="destructive" disabled={signOutLoading}>
              {signOutLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        )}

        {/* Rest of your dashboard content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Referral Buddy</h2>
          <p className="mb-4">
            This is where your personal outbound assistant features would appear. You can manage your campaigns,
            integrations, and templates here.
          </p>
          {/* Add other dashboard components/features here */}
        </div>
      </div>
    </div>
  )
}

