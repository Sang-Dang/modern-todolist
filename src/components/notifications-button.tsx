import { Button } from '@/components/ui/button'
import { createSubscriber } from '@/lib/novu/general'
import { api } from '@/utils/api'
import { cn } from '@/utils/helper'
import { NovuProvider, PopoverNotificationCenter, type IMessage } from '@novu/notification-center'
import { Bell } from 'lucide-react'
import { useEffect } from 'react'

type NotificationsButtonProps = {
    userId: string
    className?: string
}

export default function NotificationsButton({ userId, className }: NotificationsButtonProps) {
    const { mutate: createSubscriber } = api.notification.createSubscriber.useMutation()

    useEffect(() => {
        createSubscriber()
    }, [createSubscriber])

    function onNotificationClick(message: IMessage) {
        // your logic to handle the notification click
        if (message?.cta?.data?.url) {
            window.location.href = message.cta.data.url
        }
    }

    return (
        <NovuProvider subscriberId={userId} applicationIdentifier={'2F0o6JBS2OVq'}>
            <PopoverNotificationCenter onNotificationClick={onNotificationClick} colorScheme="light" footer={() => <></>} position="bottom">
                {({ unseenCount }) => (
                    <Button variant="ghost" className={cn('relative h-10 w-10 p-0 hover:bg-white/20', className)}>
                        <Bell color="white" />
                        {unseenCount ? (
                            <span className="absolute right-0 top-0 grid h-5 w-5 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-red-500 text-[11px] font-extrabold text-white">
                                {unseenCount}
                            </span>
                        ) : (
                            ''
                        )}
                    </Button>
                )}
            </PopoverNotificationCenter>
        </NovuProvider>
    )
}
