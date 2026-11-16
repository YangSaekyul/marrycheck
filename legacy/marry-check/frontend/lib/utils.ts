import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to merge class names with tailwind-merge and clsx.
 * Usage: cn('p-2', isActive && 'bg-blue-500', 'text-sm')
 */
export function cn(...inputs: Array<any>) {
  return twMerge(clsx(...inputs))
}

export default cn
