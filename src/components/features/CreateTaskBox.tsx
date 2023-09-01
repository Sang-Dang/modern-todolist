import { Bell, Calendar, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
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

const defaultTask = {
    name: ''
}

export default function CreateTaskBox({ className }: CreateTaskBoxProps) {
    const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [task, setTask] = useState<z.infer<typeof taskInput>>(defaultTask)

    const trpc = api.useContext()
    const { mutate } = api.task.create.useMutation({
        onSuccess: () => {
            toast.success('Task created')
            setTask(defaultTask)
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })
    const handleCreateTask = useCallback(() => {
        if (!taskInput.safeParse(task).success) {
            toast.error('Invalid task name')
            return
        }

        mutate(task)
    }, [task, mutate])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isFocused) {
                handleCreateTask()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleCreateTask, isFocused])

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.value) {
            setIsOptionsOpen(false)
        } else {
            setIsOptionsOpen(true)
        }
        setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleFocus() {
        setIsOptionsOpen(true)
        setIsFocused(true)
    }

    function handleBlur() {
        setIsFocused(false)
    }

    return (
        <div className={cn('flex flex-col gap-0', className)}>
            <div className="relative">
                <AnimatePresence>
                    {isOptionsOpen ? (
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
                    name="name"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    placeholder="Add a task"
                    className={cn(
                        'relative z-10 flex h-14 w-full items-center rounded-md bg-white py-3 pl-[59px] pr-6 text-[17px] shadow-md outline-none placeholder:text-blue-800 placeholder:opacity-80',
                        isOptionsOpen && 'rounded-b-none'
                    )}
                    autoComplete="false"
                    tabIndex={0}
                    type="text"
                    value={task.name}
                    id="input-task"
                    aria-autocomplete="none"
                />
            </div>
            <AnimatePresence>
                {isOptionsOpen && (
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
