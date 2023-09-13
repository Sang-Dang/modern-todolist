import { Button } from '@/components/ui/button'
import { cn } from '@/utils/helper'
import { AlertCircle, Calendar, CalendarDays, Inbox } from 'lucide-react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ComponentType, type ReactNode } from 'react'
const Header = dynamic(() => import('@/components/header'), { ssr: false, loading: () => <div>Loading...</div> })

export const tabs: Tab[] = [
    {
        Icon: <CalendarDays strokeWidth={1.2} size={18} />,
        title: 'Today',
        url: '/tasks/today'
    },
    {
        Icon: <AlertCircle strokeWidth={1.2} size={18} />,
        title: 'Important',
        url: '/tasks/important'
    },
    {
        Icon: <Calendar strokeWidth={1.2} size={18} />,
        title: 'Planned',
        url: '/tasks/planned'
    },
    {
        Icon: <Inbox strokeWidth={1.2} size={18} />,
        title: 'Inbox',
        url: '/tasks/inbox'
    }
]

type Props = {
    children: ReactNode
}

const Homepage = ({ children }: Props) => {
    const router = useRouter()
    const currentTab = router.pathname

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            void router.push('/')
        }
    })

    if (!session) {
        return <div className="grid place-items-center">Loading...</div>
    }

    return (
        <div id="page_home" className="flex h-screen flex-col pt-16">
            <Header userId={session.user.id} userImage={session.user.image} />
            <main className="relative flex h-full">
                <aside className="relative z-10 flex h-full w-96 flex-col bg-white py-3 shadow-md">
                    {tabs.map((tab) => (
                        <Link href={tab.url} key={tab.url} prefetch={false}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    'flex h-full w-full items-center justify-start gap-5 rounded-none px-7 text-[16px] font-[370]',
                                    tab.url === currentTab && 'bg-blue-200/50 font-semibold'
                                )}
                            >
                                {tab.Icon}
                                {tab.title}
                            </Button>
                        </Link>
                    ))}
                </aside>
                <div className="h-full w-full bg-[#faf9f8]">{children}</div>
            </main>
        </div>
    )
}

export default function withTabLayout<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>) {
    return function comp(props: T) {
        return (
            <Homepage>
                <Component {...props} />
            </Homepage>
        )
    }
}
