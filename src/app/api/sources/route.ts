import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerSupabaseClient()

  // 최소 한 개 이상의 추천 식당이 있는 프로그램만 조회 (inner join 활용)
  const { data, error } = await supabase
    .from("sources")
    .select("id, name, restaurant_recommendations!inner(restaurant_id)")
    .eq("is_delete", false)
    .order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
