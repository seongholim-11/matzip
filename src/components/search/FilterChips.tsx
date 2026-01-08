"use client"

import { CATEGORIES } from "@/lib/constants/categories"
import type { Program } from "@/types/model"

interface FilterChipsProps {
  selectedCategory: string | null
  selectedProgram: string | null
  onCategoryChange: (category: string | null) => void
  onProgramChange: (programId: string | null) => void
  programs?: Program[]
}

export function FilterChips({
  selectedCategory,
  selectedProgram,
  onCategoryChange,
  onProgramChange,
  programs = [],
}: FilterChipsProps) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      {/* 전체 버튼 */}
      <button
        onClick={() => {
          onCategoryChange(null)
          onProgramChange(null)
        }}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !selectedCategory && !selectedProgram
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        }`}
      >
        전체
      </button>

      {/* 카테고리 칩 */}
      {CATEGORIES.slice(0, 6).map((category) => (
        <button
          key={category.id}
          onClick={() => {
            onCategoryChange(
              category.id === selectedCategory ? null : category.id
            )
            if (selectedProgram) onProgramChange(null)
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          {category.icon} {category.name}
        </button>
      ))}

      {/* 프로그램 칩 */}
      {programs.slice(0, 4).map((program) => (
        <button
          key={program.id}
          onClick={() => {
            onProgramChange(program.id === selectedProgram ? null : program.id)
            if (selectedCategory) onCategoryChange(null)
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedProgram === program.id
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
          }`}
        >
          📺 {program.name}
        </button>
      ))}
    </div>
  )
}
