export {}

declare global {
    type Tab = {
        Icon: LucideIcon
        title: string
        url: string
        Component?: React.ReactNode
    }

    type UserRole = 'admin' | 'user'

    type responseBundle = {
        success: boolean
        message: string[]
    }
}
