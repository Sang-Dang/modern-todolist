import TaskContextMenu from '@/components/features/TaskContextMenu'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/utils/api'
import { cn, join } from '@/utils/helper'
import { taskCompleteInput } from '@/validation/task'
import { type Task } from '@prisma/client'
import { format, isPast } from 'date-fns'
import { Bell, Calendar } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'

export type TaskCardProps = {
    task: Task
    onClick?: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const trpc = api.useContext()
    const { mutate } = api.task.toggleComplete.useMutation({
        onSuccess: () => {
            toast.success('Task updated')
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })

    function toggleCompleteTask(taskId: string, completed: boolean) {
        const object = {
            id: taskId,
            completed: completed
        }

        if (!taskCompleteInput.safeParse(object).success) {
            toast.error('Invalid task')
            return
        }

        mutate(object)
    }

    return (
        <TaskContextMenu taskId={task.id}>
            <li className="relative list-none">
                <div
                    onClick={onClick}
                    className="flex h-14 w-full cursor-pointer items-center rounded-md bg-white py-3 pl-14 pr-6 shadow-md transition-all hover:bg-slate-50"
                >
                    <div className="flex flex-col">
                        <h5 className={cn('text-[15px]', task.completed && 'text-slate-500 line-through')}>{task.name}</h5>
                        <caption className="flex items-center gap-3">
                            {join(
                                [
                                    task.dueDate && (
                                        <div
                                            key={`caption-1-${task.id}`}
                                            className={cn('flex items-center gap-1', isPast(task.dueDate) && 'text-red-700')}
                                        >
                                            <Calendar size={12} />
                                            <span className="text-xs">
                                                {isPast(task.dueDate) ? 'Overdue' : 'Due'} {format(task.dueDate, 'EEE, MMMM d')}
                                            </span>
                                        </div>
                                    ),
                                    task.reminders.length > 0 && (
                                        <div key={`caption-2-${task.id}`} className="flex items-center gap-1">
                                            <Bell size={12} />
                                            <span className="text-xs">{format(task.reminders[0]!, 'EEE, MMMM d')}</span>
                                        </div>
                                    )
                                ].filter((item) => item),
                                <span>•</span>
                            )}
                        </caption>
                    </div>
                </div>
                <Checkbox
                    className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border-2 border-blue-800"
                    checkIconContainerClassName="bg-blue-800 rounded-full outline-none"
                    defaultCheckIconClassName="text-white w-full h-full"
                    checked={task.completed}
                    onClick={() => toggleCompleteTask(task.id, !task.completed)}
                />
            </li>
        </TaskContextMenu>
    )
}
