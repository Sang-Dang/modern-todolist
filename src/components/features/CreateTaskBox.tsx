import { Bell, Calendar, Plus } from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/helper'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { api } from '@/utils/api'
import { taskInput } from '@/validation/task'
import { type z } from 'zod'
import toast from 'react-hot-toast'

type CreateTaskBoxProps = {
    className?: string
}

const CheckboxMotion = motion(Checkbox)
const PlusIconMotion = motion(Plus)

export default function CreateTaskBox({ className }: CreateTaskBoxProps) {
    const trpc = api.useContext()

    const { mutate } = api.task.create.useMutation({
        onSuccess: () => {
            toast.success('Task created')
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [task, setTask] = useState<z.infer<typeof taskInput>>({
        name: ''
    })

    function handleCreateTask() {
        if (!taskInput.safeParse(task).success) {
            toast.error('Invalid task name')
            return
        }

        mutate(task)
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.value) {
            setIsFocused(false)
        } else {
            setIsFocused(true)
        }
        setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleFocus() {
        setIsFocused(true)
    }

    return (
        <div className={cn('flex flex-col gap-0', className)}>
            <div className="relative">
                <AnimatePresence>
                    {isFocused ? (
                        <CheckboxMotion
                            initial={{ opacity: 0, scale: 0.5, origin: 'center' }}
                            animate={{ opacity: 1, scale: 1, translateY: '-50%', origin: 'center' }}
                            transition={{
                                duration: 0.3,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}
                            disabled
                            className="absolute left-6 top-1/2 z-20 h-4 w-4 rounded-full border-2 border-blue-800"
                        />
                    ) : (
                        <PlusIconMotion
                            initial={{ opacity: 0, scale: 0.5, origin: 'center' }}
                            animate={{ opacity: 1, scale: 1, translateY: '-50%', origin: 'center' }}
                            transition={{
                                duration: 0.3,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}
                            strokeWidth={2}
                            size={24}
                            className="absolute left-6 top-1/2 z-20 mr-6 h-5 w-5 text-blue-800"
                        />
                    )}
                </AnimatePresence>
                <input
                    onFocus={handleFocus}
                    name="name"
                    onChange={handleInputChange}
                    placeholder="Add a task"
                    className={cn(
                        'relative z-10 flex h-14 w-full items-center rounded-md bg-white py-3 pl-[59px] pr-6 text-[17px] shadow-md outline-none placeholder:text-blue-800 placeholder:opacity-80',
                        isFocused && 'rounded-b-none'
                    )}
                    autoComplete="off"
                    type="text"
                    list="autocompleteOff"
                    value={task.name}
                />
            </div>
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="relative z-0 flex w-full items-center gap-2 rounded-b-md border-t-[1px] border-t-slate-500/50 bg-blue-100/50 px-6 py-3 shadow-md"
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex h-min w-min items-center gap-2 p-1">
                                    <Calendar strokeWidth={1.2} size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Due date</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Today</DropdownMenuItem>
                                <DropdownMenuItem>Tomorrow</DropdownMenuItem>
                                <DropdownMenuItem>Next week</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Custom</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex h-min w-min items-center gap-2 p-1">
                                    <Bell strokeWidth={1.2} size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Reminder</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Today</DropdownMenuItem>
                                <DropdownMenuItem>Tomorrow</DropdownMenuItem>
                                <DropdownMenuItem>Next week</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Custom</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button className="ml-auto h-full" onClick={handleCreateTask}>
                            Add
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
