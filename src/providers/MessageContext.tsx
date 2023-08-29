import { message } from 'antd'
import { type ConfigOptions, type MessageInstance } from 'antd/es/message/interface'
import { createContext, useContext } from 'react'

type MessageContextProviderProps = {
    children: React.ReactNode
    configOptions?: ConfigOptions
}

type MessageContextProps = {
    api: MessageInstance | undefined
}

const MessageContext = createContext<MessageContextProps>({
    api: undefined
})

export function MessageContextProvider({ children, configOptions }: MessageContextProviderProps) {
    const [api, contextHolder] = message.useMessage(configOptions)

    return (
        <MessageContext.Provider value={{ api }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    )
}

export default function useMessageContext(): [api: MessageInstance] {
    const { api } = useContext(MessageContext)

    if (!api) {
        throw new Error('Please use this in MessageContextProvider')
    }

    return [api]
}
