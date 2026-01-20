"use client"

import { useRef, useState, MouseEvent } from "react"

import { CATEGORIES } from "@/lib/constants/categories"
import type { Program } from "@/types/model"

interface FilterChipsProps {
  selectedCategory: string | null
  selectedPrograms: string[]
  onCategoryChange: (category: string | null) => void
  onProgramToggle: (programId: string) => void
  onProgramsClear: () => void
  programs?: Program[]
}

/**
 * 드래그 앤 스크롤 훅
 */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 상태 변경으로 인한 리렌더링 없이 로직 판단을 위해 ref 사용
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isDragAction = useRef(false) // 실제 드래그 동작이 일어났는지 여부

  const onMouseDown = (e: MouseEvent) => {
    if (!ref.current) return
    isDown.current = true
    isDragAction.current = false
    startX.current = e.pageX - ref.current.offsetLeft
    scrollLeft.current = ref.current.scrollLeft
  }

  const onMouseLeave = () => {
    isDown.current = false
    setIsDragging(false)
  }

  const onMouseUp = () => {
    isDown.current = false
    setIsDragging(false)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown.current || !ref.current) return
    e.preventDefault()

    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX.current) * 1.5 // 스크롤 속도

    // 일정 픽셀 이상 움직였을 때만 드래그로 간주 (클릭과 구분)
    if (Math.abs(walk) > 5) {
      isDragAction.current = true
      setIsDragging(true)
    }

    ref.current.scrollLeft = scrollLeft.current - walk
  }

  // 캡처 단계에서 클릭 이벤트 가로채기
  const onClickCapture = (e: MouseEvent) => {
    if (isDragAction.current) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    onClickCapture,
    isDragging,
  }
}

/**
 * 음식 종류(한식, 일식 등)나 방송 종류를 필터링하는 버튼(칩)들입니다.
 */
export function FilterChips({
  selectedCategory,
  selectedPrograms,
  onCategoryChange,
  onProgramToggle,
  onProgramsClear,
  programs = [],
}: FilterChipsProps) {
  const programsScroll = useDragScroll()
  const categoriesScroll = useDragScroll()

  return (
    <div className="flex flex-col gap-3 pb-2 text-sm">
      {/* 2. 방송 프로그램 필터 섹션 (사용자가 더 중요하게 생각함) */}
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground px-1 text-xs font-semibold">
          방송 프로그램
        </span>
        <div
          ref={programsScroll.ref}
          className={`scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto ${programsScroll.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={programsScroll.onMouseDown}
          onMouseLeave={programsScroll.onMouseLeave}
          onMouseUp={programsScroll.onMouseUp}
          onMouseMove={programsScroll.onMouseMove}
          onClickCapture={programsScroll.onClickCapture}
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY
            }
          }}
        >
          {programs.map((program) => {
            const isSelected = selectedPrograms.includes(program.id)
            return (
              <div key={program.id} className="relative shrink-0">
                <button
                  onClick={() => onProgramToggle(program.id)}
                  className={`rounded-full px-3 py-1.5 font-medium transition-colors select-none ${
                    isSelected
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-orange-100 bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  {isSelected && "✓ "}
                  {program.name}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. 음식 종류 필터 섹션 */}
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground px-1 text-xs font-semibold">
          음식 종류
        </span>
        <div
          ref={categoriesScroll.ref}
          className={`scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto ${categoriesScroll.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={categoriesScroll.onMouseDown}
          onMouseLeave={categoriesScroll.onMouseLeave}
          onMouseUp={categoriesScroll.onMouseUp}
          onMouseMove={categoriesScroll.onMouseMove}
          onClickCapture={categoriesScroll.onClickCapture}
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY
            }
          }}
        >
          {CATEGORIES.slice(0, 8).map((category) => (
            <div key={category.id} className="relative shrink-0">
              <button
                onClick={() =>
                  onCategoryChange(
                    category.id === selectedCategory ? null : category.id
                  )
                }
                className={`rounded-full px-3 py-1.5 font-medium transition-colors select-none ${
                  selectedCategory === category.id
                    ? "bg-slate-800 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 1. 필터 초기화 버튼 (선택된 게 있을 때만 노출하거나 하단에 배치 등 고려) */}
      {(selectedPrograms.length > 0 || selectedCategory) && (
        <div className="flex justify-end px-1">
          <button
            onClick={() => {
              onCategoryChange(null)
              onProgramsClear()
            }}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  )
}
