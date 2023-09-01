import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { api } from '@/utils/api'
import React from 'react'
import toast from 'react-hot-toast'

export type TaskContextMenuProps = {
    children: React.ReactNode
    taskId: string
}

export default function TaskContextMenu({ children, taskId }: TaskContextMenuProps) {
    const trpc = api.useContext()
    const { mutate: deleteTask } = api.task.delete.useMutation({
        onSuccess: () => {
            toast.success('Task deleted')
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })

    function handleDeleteTask() {
        deleteTask({ id: taskId })
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={handleDeleteTask}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
