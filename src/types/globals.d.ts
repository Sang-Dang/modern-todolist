export {}

declare global {
    type Tab = {
        Icon: LucideIcon
        title: string
        url: string
        Component?: React.ReactNode
    }
}
