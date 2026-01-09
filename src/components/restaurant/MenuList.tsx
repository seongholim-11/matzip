"use client"

import { Star } from "lucide-react"
import Image from "next/image"

import { formatPrice } from "@/lib/utils/formatting"
import type { Menu } from "@/types/model"

interface MenuListProps {
  menus: Menu[]
}

/**
 * 맛집의 메뉴들을 목록 형태로 보여주는 컴포넌트입니다.
 */
export function MenuList({ menus }: MenuListProps) {
  /** 사용자가 보기 편하게 '대표 메뉴'를 리스트의 가장 위로 올립니다. */
  const sortedMenus = [...menus].sort((a, b) => {
    if (a.is_main && !b.is_main) return -1
    if (!a.is_main && b.is_main) return 1
    return 0
  })

  return (
    <div className="divide-y rounded-xl border">
      {sortedMenus.map((menu) => (
        <div key={menu.id} className="flex items-center gap-4 p-4">
          {/* 메뉴 이미지 */}
          {menu.image_url && (
            <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={menu.image_url}
                alt={menu.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}

          {/* 메뉴 이름 및 대표 메뉴 표시(별 아이콘) */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{menu.name}</h4>
              {menu.is_main && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  <Star className="h-3 w-3" />
                  대표
                </span>
              )}
            </div>
            <p className="text-primary mt-1 font-semibold">
              {formatPrice(menu.price)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
