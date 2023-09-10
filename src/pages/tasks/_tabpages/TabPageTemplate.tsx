import CreateTaskBox from '@/components/features/CreateTaskBox'
import TaskCard from '@/components/features/TaskCard'
import TaskEdit from '@/components/features/TaskEdit'
import Time from '@/components/time'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useReminders } from '@/context/RemindersContext'
import { api } from '@/utils/api'
import { cn } from '@/utils/helper'
import { type taskInput } from '@/validation/task'
import { type Task } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowDownUp, ArrowUp, MoreHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { type z } from 'zod'

type TabPageTemplateProps = {
    filterFn: (task: Task) => boolean
    icon: React.ReactNode
    title: string
    defaultTask: z.infer<typeof taskInput>
}

const MotionAccordion = motion(Accordion)
const MotionTaskCard = motion(TaskCard)

type sortingValueProps = {
    label: string
}

type sortingValues = 'createdAt' | 'name' | 'starred' | 'updatedAt'

const sortingValuesObject = {
    createdAt: { label: 'Created at' },
    updatedAt: { label: 'Updated at' },
    name: { label: 'Name' },
    starred: { label: 'Importance' }
} as Record<sortingValues, sortingValueProps>

export default function TabPageTemplate({ filterFn, icon, title, defaultTask }: TabPageTemplateProps) {
    const query = api.task.all.useQuery()
    const remindersContext = useReminders()
    const completed = useMemo(() => query.data?.filter((task: Task) => task.completed === true), [query.data])
    const [sortingValue, setSortingValue] = useState<sortingValues>('createdAt')
    const [reversed, setReversed] = useState<boolean>(true)

    const [taskEditorOpen, setTaskEditorOpen] = useState<boolean>(false)
    const [currentTaskEdit, setCurrentTaskEdit] = useState<Task | undefined>(undefined)

    useEffect(() => {
        if (query.data) {
            remindersContext.addMany(query.data, remindersContext.callbacks.taskReminderCallback)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.isLoading])

    const tasks = useMemo(() => {
        if (query.isLoading) {
            return undefined
        }
        let result = query.data?.sort((a, b) => {
            const aValue = typeof a[sortingValue] === 'string' ? (a[sortingValue] as string).toLowerCase()! : a[sortingValue]!
            const bValue = typeof b[sortingValue] === 'string' ? (b[sortingValue] as string).toLowerCase()! : b[sortingValue]!

            if (aValue < bValue) return -1
            if (aValue > bValue) return 1
            return 0
        })

        result = result?.filter((task: Task) => {
            return filterFn(task)
        })

        return reversed ? result?.reverse() : result
    }, [filterFn, query.data, query.isLoading, reversed, sortingValue])

    function handleEditTask(task: Task) {
        setCurrentTaskEdit(task)
        setTaskEditorOpen(true)
    }

    if (query.isLoading || tasks === undefined) return <div>Loading...</div>
    if (query.isError) return <div>Error</div>

    return (
        <article className="flex h-full flex-1 flex-col">
            <header className="col-span-1 h-auto p-8">
                <div className="flex w-full justify-between">
                    <h2 className="mb-2 flex cursor-default select-none items-center gap-3 text-2xl font-bold">
                        {icon}
                        {title}
                        <MoreHorizontal size={20} strokeWidth={1.25} className="ml-2" />
                    </h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-1">
                                <ArrowDownUp size={20} strokeWidth={1.25} />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.entries(sortingValuesObject).map(([key, value]) => (
                                <DropdownMenuItem
                                    key={key}
                                    className={cn('flex items-center gap-2', sortingValue === key && 'font-bold text-blue-800')}
                                    onClick={() => {
                                        if (key === sortingValue) {
                                            setReversed(!reversed)
                                        } else {
                                            setSortingValue(key as sortingValues)
                                        }
                                    }}
                                >
                                    <span>{value.label}</span>
                                    {sortingValue === key && (reversed ? <ArrowDown size={20} /> : <ArrowUp size={20} />)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="text-xs text-slate-500" key={new Date().toDateString()}>
                    <Time dateProps="HH:mm:ss, EEEE, MMMM d" />
                </div>
            </header>
            <CreateTaskBox className="px-8" defaultTask={defaultTask} />
            <ScrollArea className="px-8">
                <ul className="flex flex-col gap-2 py-5">
                    <AnimatePresence>
                        {tasks
                            .filter((task: Task) => task.completed === false)
                            .map((task: Task) => (
                                <MotionTaskCard
                                    key={task.id}
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    task={task}
                                    onClick={() => handleEditTask(task)}
                                />
                            ))}
                    </AnimatePresence>
                </ul>
                <AnimatePresence>
                    {completed?.length !== 0 && (
                        <MotionAccordion
                            initial={{ opacity: 0, scale: 0.5, origin: 'center' }}
                            animate={{ opacity: 1, scale: 1, origin: 'center' }}
                            exit={{ opacity: 0, scale: 0.5, origin: 'center' }}
                            transition={{
                                duration: 0.3,
                                ease: [0, 0.71, 0.2, 1.01],
                                delay: 0.5
                            }}
                            type="single"
                            collapsible
                        >
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Completed ({completed?.length})</AccordionTrigger>
                                <AccordionContent asChild>
                                    <div className="flex flex-col gap-2">
                                        {tasks
                                            .filter((task: Task) => task.completed === true)
                                            .map((task: Task) => (
                                                <TaskCard key={task.id} task={task} onClick={() => handleEditTask(task)} />
                                            ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </MotionAccordion>
                    )}
                </AnimatePresence>
            </ScrollArea>
            <TaskEdit open={taskEditorOpen} task={currentTaskEdit!} setOpen={setTaskEditorOpen} />
        </article>
    )
}
