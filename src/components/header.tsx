import NotificationsButton from '@/components/notifications-button'
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Cloud, CreditCard, Github, Menu, Settings, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import router from 'next/router'
import React from 'react'

type Props = {
    userId: string
    userImage: string | undefined | null
}

export default function Header({ userId, userImage }: Props) {
    return (
        <header className="fixed left-0 top-0 z-20 flex h-16 w-full items-center justify-between gap-10 bg-blue-700/90 px-5 py-4">
            <div className="flex items-center gap-3">
                <Button variant="ghost" className="h-10 w-10 p-1 hover:bg-blue-500">
                    <Menu color="white" size={20} />
                </Button>
                <h1 className="mb-0 cursor-pointer select-none text-2xl font-extrabold text-white" onClick={() => void router.push('/tasks/today')}>
                    Todolist
                </h1>
            </div>
            <Input className="w-4/12" placeholder={'Search'} />
            <div className="flex items-center gap-4">
                <NotificationsButton userId={userId} />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="">
                            <AvatarImage src={userImage!} />
                            <AvatarFallback>AVA</AvatarFallback>
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
    )
}
