import { MetadataRoute } from "next"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const BASE_URL = "https://matzip.example.com" // TODO: Update with real domain

  // 1. Static Routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  // 2. Dynamic Restaurant Routes
  try {
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("id, updated_at")
      // .eq("is_delete", false) // TODO: If schema supports soft delete
      .order("created_at", { ascending: false })
      .limit(1000) // Limit for sitemap size considerations

    if (restaurants) {
      const restaurantRoutes = restaurants.map((restaurant) => ({
        url: `${BASE_URL}/restaurant/${restaurant.id}`,
        lastModified: new Date(restaurant.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
      routes.push(...restaurantRoutes)
    }
  } catch (error: any) {
    console.error("Failed to generate sitemap:", error.message)
  }

  return routes
}
