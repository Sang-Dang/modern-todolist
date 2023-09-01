import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPlural(value: number, string: string, pluralString: string): string {
    return value === 1 ? `${value} ${string}` : `${value} ${pluralString}`
}

export function formatDate(date: Date): string {
    const { day, month, dayOfWeek, year } = getDateComponents(date)
    return `${dayOfWeek}, ${month} ${day}, ${year}`
}

export function getDateComponents(date: Date): { month: string; day: number; dayOfWeek: string; year: number } {
    const month = months[date.getUTCMonth()]!
    const day = date.getUTCDate()
    const dayOfWeek = days[date.getUTCDay()]!
    const year = date.getUTCFullYear()

    return {
        month,
        day,
        dayOfWeek,
        year
    }
}

export function getDateXAgo(pastDate: Date): string {
    const list = getDateDifference(new Date(), pastDate)
    if (list.years !== 0) return `${getPlural(list.years, 'year', 'years')} ago`
    if (list.months !== 0) return `${getPlural(list.months, 'month', 'months')} ago`
    if (list.days !== 0) return `${getPlural(list.days, 'day', 'days')} ago`
    if (list.hours !== 0) return `${getPlural(list.hours, 'hour', 'hours')} ago`
    if (list.minutes !== 0) return `${getPlural(list.minutes, 'minute', 'minutes')} ago`
    return `${getPlural(list.seconds, 'second', 'seconds')} ago`
}

export function getDateDifference(
    after: Date,
    before: Date
): {
    years: number
    months: number
    days: number
    seconds: number
    minutes: number
    hours: number
} {
    const diff = Math.floor(after.getTime() - before.getTime())

    const second = 1000
    const seconds = Math.floor(diff / second)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 31)
    const years = Math.floor(months / 12)

    return {
        days,
        months,
        years,
        seconds,
        minutes,
        hours
    }
}
