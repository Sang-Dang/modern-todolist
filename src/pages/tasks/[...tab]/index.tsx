import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/helper'
import { AlertCircle, Calendar, CalendarDays, Cloud, CreditCard, Github, Inbox, Menu, Settings, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Important from '../_tabpages/Important'
import Planned from '../_tabpages/Planned'
import TasksList from '../_tabpages/TasksList'
import Today from '../_tabpages/Today'
import NotificationsButton from '@/components/notifications-button'

export const tabs: Tab[] = [
    {
        Icon: <CalendarDays strokeWidth={1.2} size={18} />,
        title: 'Today',
        url: '/tasks/today',
        Component: <Today />
    },
    {
        Icon: <AlertCircle strokeWidth={1.2} size={18} />,
        title: 'Important',
        url: '/tasks/important',
        Component: <Important />
    },
    {
        Icon: <Calendar strokeWidth={1.2} size={18} />,
        title: 'Planned',
        url: '/tasks/planned',
        Component: <Planned />
    },
    {
        Icon: <Inbox strokeWidth={1.2} size={18} />,
        title: 'Inbox',
        url: '/tasks/inbox',
        Component: <TasksList />
    }
]

type Props = {}

export default function Homepage({}: Props) {
    const router = useRouter()
    const currentTab = router.query.tab! as string[]
    const currentTabString = '/tasks/'.concat(currentTab?.join('/'))

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            void router.push('/')
        }
    })

    if (!session || !currentTab) {
        return <div className="grid place-items-center">Loading...</div>
    }

    return (
        <div id="page_home" className="flex h-screen flex-col pt-16">
            <header className="fixed left-0 top-0 z-20 flex h-16 w-full items-center justify-between gap-10 bg-blue-700/90 px-5 py-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="h-10 w-10 p-1 hover:bg-blue-500">
                        <Menu color="white" size={20} />
                    </Button>
                    <h1
                        className="mb-0 cursor-pointer select-none text-2xl font-extrabold text-white"
                        onClick={() => void router.push('/tasks/today')}
                    >
                        Todolist
                    </h1>
                </div>
                <Input className="w-4/12" placeholder={'Search'} />
                <div className="flex items-center gap-4">
                    <NotificationsButton userId={session.user.id} />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="">
                                <AvatarImage src={session.user.image!} />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Cloud className="mr-2 h-4 w-4" />
                                    <span>API</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => window.open('https://github.com/Sang-Dang/modern-todolist', '__blank')}
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    <span>GitHub</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="foOnt-bold cursor-pointer bg-red-500 text-white"
                                onClick={() => void signOut({ callbackUrl: '/' })}
                            >
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="relative flex h-full">
                <aside className="relative z-10 flex h-full w-96 flex-col bg-white py-3 shadow-md">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.url}
                            variant="ghost"
                            className={cn(
                                'flex items-center justify-start gap-5 rounded-none px-7 text-[16px] font-[370]',
                                tab.url === currentTabString && 'group bg-blue-200/50 font-semibold'
                            )}
                            onClick={() => void router.push(tab.url)}
                        >
                            {tab.Icon}
                            {tab.title}
                        </Button>
                    ))}
                </aside>
                <div className="h-full w-full bg-[#faf9f8]">{tabs.map((tab) => tab.url === currentTabString && tab.Component)}</div>
            </main>
        </div>
    )
}
