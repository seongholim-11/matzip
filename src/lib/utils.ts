import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 여러 개의 CSS 클래스들을 하나로 합쳐주는 유틸리티 함수입니다.
 * 조건부 클래스(clsx)와 테일윈드 클래스 중복 제거(twMerge)를 함께 처리합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
