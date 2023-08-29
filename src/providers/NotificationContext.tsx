import { notification } from 'antd'
import { type NotificationConfig, type NotificationInstance } from 'antd/es/notification/interface'
import { createContext, useContext } from 'react'

type NotificationContextProviderProps = {
    children: React.ReactNode
    notificationConfig?: NotificationConfig
}

type NotificationContextType = {
    api: NotificationInstance | undefined
}

const NotificationContext = createContext<NotificationContextType>({
    api: undefined
})

export function NotificationContextProvider({
    children,
    notificationConfig
}: NotificationContextProviderProps) {
    const [api, contextHolder] = notification.useNotification(notificationConfig)

    return (
        <NotificationContext.Provider value={{ api }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    )
}

export default function useNotificationContext(): [api: NotificationInstance] {
    const { api } = useContext(NotificationContext)

    if (!api) {
        throw new Error('Please use this in NotificationContextProvider')
    }

    return [api]
}
