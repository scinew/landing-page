import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const deterministicTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
})

export function formatTimestamp(value: number | string | Date) {
  const date =
    value instanceof Date ? value : typeof value === "number" ? new Date(value) : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return deterministicTimeFormatter.format(date)
}
