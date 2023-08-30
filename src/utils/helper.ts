import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const month = months[date.getUTCMonth()]
    const day = date.getUTCDate()
    const dayOfWeek = days[date.getUTCDay()]
    const year = date.getUTCFullYear()

    return `${dayOfWeek}, ${month} ${day}, ${year}`
}
