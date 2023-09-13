import CreateTaskBox from '@/modules/TabPageTemplate/components/CreateTaskBox'
import TaskList from '@/modules/TabPageTemplate/components/TaskList'
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
import { cn } from '@/utils/helper'
import { type taskInput } from '@/validation/task'
import { type Task } from '@prisma/client'
import { type UseTRPCQueryResult } from '@trpc/react-query/shared'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowDownUp, ArrowUp, MoreHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { type z } from 'zod'

type TabPageTemplateProps<TError> = {
    icon: React.ReactNode
    title: string
    defaultTask: z.infer<typeof taskInput>
    fetchData: UseTRPCQueryResult<
        {
            incompleted: Task[]
            completed: Task[]
        },
        TError
    >
}

const MotionAccordion = motion(Accordion)

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

export default function TabPageTemplate<TError>({ icon, title, defaultTask, fetchData: query }: TabPageTemplateProps<TError>) {
    const remindersContext = useReminders()
    const [sortingValue, setSortingValue] = useState<sortingValues>('createdAt')
    const [reversed, setReversed] = useState<boolean>(true)

    useEffect(() => {
        if (query.data) {
            remindersContext.addMany(query.data.incompleted, remindersContext.callbacks.taskReminderCallback)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.isLoading])

    const tasks = useMemo(() => {
        if (query.isLoading) {
            return undefined
        }
        const result = query.data?.incompleted.sort((a, b) => {
            const aValue = typeof a[sortingValue] === 'string' ? (a[sortingValue] as string).toLowerCase()! : a[sortingValue]!
            const bValue = typeof b[sortingValue] === 'string' ? (b[sortingValue] as string).toLowerCase()! : b[sortingValue]!

            if (aValue < bValue) return -1
            if (aValue > bValue) return 1
            return 0
        })

        return reversed ? result?.reverse() : result
    }, [query.data, query.isLoading, reversed, sortingValue])

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
                <TaskList tasks={tasks} />
                <AnimatePresence>
                    {query.data?.completed.length !== 0 && (
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
                                <AccordionTrigger>Completed ({query.data?.completed.length})</AccordionTrigger>
                                <AccordionContent asChild>
                                    <TaskList tasks={query.data?.completed} />
                                </AccordionContent>
                            </AccordionItem>
                        </MotionAccordion>
                    )}
                </AnimatePresence>
            </ScrollArea>
        </article>
    )
}
