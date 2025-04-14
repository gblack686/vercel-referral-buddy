// This file should only be imported by server components or server actions
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// For server components only
export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies })
}
