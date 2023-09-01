import CreateTaskBox from '@/components/features/CreateTaskBox'
import TaskCard from '@/components/features/TaskCard'
import TaskEdit from '@/components/features/TaskEdit'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/utils/api'
import { formatDate } from '@/utils/helper'
import { type Task } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, CalendarDays, MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

type Props = {}

const MotionAccordion = motion(Accordion)
const MotionTaskCard = motion(TaskCard)

export default function Today({}: Props) {
    const query = api.task.all.useQuery()
    const completed = useMemo(() => query.data?.filter((task: Task) => task.completed === true), [query.data])

    const [taskEditorOpen, setTaskEditorOpen] = useState<boolean>(false)
    const [currentTaskEdit, setCurrentTaskEdit] = useState<Task | undefined>(undefined)

    function handleEditTask(task: Task) {
        setCurrentTaskEdit(task)
        setTaskEditorOpen(true)
    }

    if (query.isLoading) return <div>Loading...</div>
    if (query.isError) return <div>Error</div>

    return (
        <article className="flex h-full flex-1 flex-col">
            <header className="col-span-1 h-auto p-8">
                <div className="flex w-full justify-between">
                    <h2 className="mb-2 flex cursor-default select-none items-center gap-3 text-2xl font-bold">
                        <CalendarDays strokeWidth={1.5} size={25} />
                        Today
                        <MoreHorizontal size={20} strokeWidth={1.25} className="ml-2" />
                    </h2>
                    <Button variant="outline" className="flex items-center gap-1">
                        <ArrowDownUp size={20} strokeWidth={1.25} />
                        Sort
                    </Button>
                </div>
                <div className="text-xs text-slate-500">{formatDate(new Date())}</div>
            </header>
            <CreateTaskBox className="px-8" />
            <ScrollArea className="px-8">
                <ul className="flex flex-col gap-2 py-5">
                    <AnimatePresence>
                        {query.data
                            ?.sort((a, b) => {
                                if (!a.createdAt || !b.createdAt) return 0
                                if (a.createdAt < b.createdAt) return 1
                                if (a.createdAt > b.createdAt) return -1
                                return 0
                            })
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
                                        {query.data
                                            ?.sort((a, b) => {
                                                if (!a.createdAt || !b.createdAt) return 0
                                                if (a.createdAt < b.createdAt) return 1
                                                if (a.createdAt > b.createdAt) return -1
                                                return 0
                                            })
                                            .filter((task: Task) => task.completed === true)
                                            .map((task: Task) => <TaskCard key={task.id} task={task} onClick={() => handleEditTask(task)} />)}
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
