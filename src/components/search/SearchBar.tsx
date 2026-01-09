"use client"

import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
}

/**
 * 맛집이나 지역 이름을 입력하여 찾을 수 있는 검색창 컴포넌트입니다.
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "맛집, 지역, 프로그램 검색...",
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const handleClear = () => {
    onChange("")
  }

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-background focus:border-primary focus:ring-primary/20 h-12 w-full rounded-full border pr-12 pl-12 text-base shadow-sm transition-all focus:ring-2 focus:outline-none"
      />
      {value && (
        <button
          onClick={handleClear}
          className="hover:bg-muted absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 transition-colors"
        >
          <X className="text-muted-foreground h-4 w-4" />
        </button>
      )}
    </div>
  )
}
