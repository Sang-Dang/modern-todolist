import DateDropdownSelect from '@/components/DateDropdownSelect'
import { Checkbox } from '@/components/ui/checkbox'
import { useTaskActions } from '@/context/TaskActionsContext'
import { cn } from '@/utils/helper'
import { type taskInput } from '@/validation/task'
import { format, isToday } from 'date-fns'
import isPast from 'date-fns/isPast'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Calendar, Plus, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { type z } from 'zod'
import { Button } from '../../../components/ui/button'
import toast from 'react-hot-toast'

type CreateTaskBoxProps = {
    className?: string
    defaultTask?: z.infer<typeof taskInput>
}

const CheckboxMotion = motion(Checkbox)
const PlusIconMotion = motion(Plus)

export default function CreateTaskBox({
    className,
    defaultTask = {
        name: '',
        dueDate: undefined,
        reminders: undefined
    }
}: CreateTaskBoxProps) {
    const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [task, setTask] = useState<z.infer<typeof taskInput>>(defaultTask)
    const { create } = useTaskActions()

    // #region Create task API

    const handleCreateTask = useCallback(async () => {
        try {
            await create(task)
            setTask(defaultTask)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
    }, [create, task, defaultTask])

    // #endregion

    // used to automatically create task on enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isFocused) {
                void handleCreateTask()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleCreateTask, isFocused])

    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.value) {
            setIsOptionsOpen(false)
        } else {
            setIsOptionsOpen(true)
        }
        setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSelectDateChange(name: string, value: Date | null) {
        setTask((prev) => ({ ...prev, [name]: value }))
    }

    function handleStarredChange(target: boolean) {
        setTask((prev) => ({ ...prev, starred: target }))
    }

    // #region Focus handlers for entire input box

    function handleFocus() {
        setIsOptionsOpen(true)
        setIsFocused(true)
    }

    function handleBlur() {
        setIsFocused(false)
    }

    // #endregion

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
                    onChange={handleTextInputChange}
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
                        className="relative z-0 flex h-12 w-full items-center gap-2 rounded-b-md border-t-[1px] border-t-slate-500/50 bg-inherit px-6 py-2 shadow-md"
                    >
                        <DateDropdownSelect
                            name="dueDate"
                            label="Due Date"
                            value={task.dueDate}
                            handleChange={handleSelectDateChange}
                            className="h-full"
                        >
                            <Calendar size={16} />
                            {task.dueDate && (
                                <span>
                                    {isPast(task.dueDate) && !isToday(task.dueDate) ? 'Overdue' : 'Due'} {format(task.dueDate, 'EEE, MMMM d')}
                                </span>
                            )}
                        </DateDropdownSelect>
                        <DateDropdownSelect
                            name="reminders"
                            label="Reminder"
                            value={task.reminders}
                            handleChange={handleSelectDateChange}
                            allowTime
                            allowPast={false}
                            className="h-full"
                        >
                            <Bell size={16} />
                            {task.reminders && <span>{format(task.reminders, 'H:mm, EEE, MMMM d')}</span>}
                        </DateDropdownSelect>
                        <Button
                            className={cn('flex h-full items-center gap-2 p-2 text-xs')}
                            variant="ghost"
                            onClick={() => handleStarredChange(!task.starred)}
                        >
                            <Star size={16} fill={task.starred ? 'true' : 'transparent'} />
                        </Button>
                        <Button className="ml-auto h-full bg-blue-800 p-1 px-3 text-xs hover:bg-blue-800/80" onClick={() => void handleCreateTask()}>
                            Add
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
