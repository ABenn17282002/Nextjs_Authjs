import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind のクラス名を結合するヘルパー関数
 * clsx + tailwind-merge を組み合わせて使う
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}
