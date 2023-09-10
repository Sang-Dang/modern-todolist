import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useTaskActions } from '@/context/TaskActionsContext'
import { getDateXAgo } from '@/utils/helper'
import { type Task } from '@prisma/client'
import React from 'react'

export type TaskContextMenuProps = {
    children: React.ReactNode
    task: Task
}

export default function TaskContextMenu({ children, task }: TaskContextMenuProps) {
    const { remove } = useTaskActions()

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel>Created {getDateXAgo(task.createdAt!)}</ContextMenuLabel>
                <ContextMenuItem onClick={() => void remove(task.id)} className="bg-red-500 font-bold text-white">
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
