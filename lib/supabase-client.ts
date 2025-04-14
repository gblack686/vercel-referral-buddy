"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// For client components only
export const createClientSupabaseClient = () => {
  return createClientComponentClient()
}
