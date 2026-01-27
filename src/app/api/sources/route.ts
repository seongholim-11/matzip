import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword")
  const supabase = createServerSupabaseClient()

  // 최소 한 개 이상의 추천 식당이 있는 프로그램만 조회 (inner join 활용)
  let query = supabase
    .from("sources")
    .select("id, name, restaurant_recommendations!inner(restaurant_id)")
    .eq("is_delete", false)

  if (keyword) {
    query = query.ilike("name", `%${keyword}%`)
  }

  const { data, error } = await query.order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
