import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .order("name")

  if (error) {
    console.error("Supabase error fetching sources:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
