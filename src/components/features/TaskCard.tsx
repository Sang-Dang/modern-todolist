import TaskContextMenu from '@/components/features/TaskContextMenu'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/utils/api'
import { cn, join } from '@/utils/helper'
import { taskUpdateInputPartial } from '@/validation/task'
import { type Task } from '@prisma/client'
import { format, isPast, isToday } from 'date-fns'
import { Bell, Calendar, Star } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { ZodError, type z } from 'zod'

export type TaskCardProps = {
    task: Task
    onClick?: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const trpc = api.useContext()
    const { mutate: updateTask } = api.task.update.useMutation({
        onSuccess: () => {
            toast.success('Task updated')
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })

    function handleChange(name: string, value: unknown) {
        const updateParams = {
            id: task.id,
            [name]: value
        } as z.infer<typeof taskUpdateInputPartial>
        try {
            taskUpdateInputPartial.parse(updateParams)
            updateTask(updateParams)
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues
                errors.forEach((error) => {
                    toast.error(error.message)
                })
            }
        }
    }

    return (
        <TaskContextMenu taskId={task.id}>
            <li className="relative select-none list-none">
                <div
                    onClick={onClick}
                    className="flex h-14 w-full cursor-pointer items-center rounded-md bg-white py-3 pl-14 pr-6 shadow-md transition-all hover:bg-slate-50"
                >
                    <div className="flex flex-grow flex-col">
                        <h5 className={cn('text-[15px]', task.completed && 'text-slate-500 line-through')}>{task.name}</h5>
                        <caption className="flex items-center gap-3">
                            {join(
                                [
                                    task.dueDate && (
                                        <div
                                            key={`caption-1-${task.id}`}
                                            className={cn(
                                                'flex items-center gap-1',
                                                isPast(task.dueDate) && !isToday(task.dueDate) && 'text-red-700'
                                            )}
                                        >
                                            <Calendar size={12} />
                                            <span className="text-xs">
                                                {isPast(task.dueDate) && !isToday(task.dueDate) ? 'Overdue' : 'Due'}{' '}
                                                {format(task.dueDate, 'EEE, MMMM d')}
                                            </span>
                                        </div>
                                    ),
                                    task.reminders && (
                                        <div key={`caption-2-${task.id}`} className="flex items-center gap-1">
                                            <Bell size={12} />
                                            <span className="text-xs">{format(task.reminders, 'EEE, MMMM d')}</span>
                                        </div>
                                    )
                                ].filter((item) => item),
                                <span>•</span>
                            )}
                        </caption>
                    </div>
                </div>
                <Button
                    name="starred"
                    onClick={() => handleChange('starred', !task.starred)}
                    className={cn(
                        'absolute right-0 top-0 h-full w-20 rounded-sm bg-white p-0 text-black transition-all duration-100 hover:bg-slate-100 active:scale-90'
                    )}
                >
                    <Star className={cn('text-blue-500')} fill={task.starred ? '#3b82f6' : 'white'} />
                </Button>
                <Checkbox
                    className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border-2 border-blue-800"
                    checkIconContainerClassName="bg-blue-800 rounded-full outline-none"
                    defaultCheckIconClassName="text-white w-full h-full"
                    checked={task.completed}
                    onClick={() => handleChange('completed', !task.completed)}
                />
            </li>
        </TaskContextMenu>
    )
}
