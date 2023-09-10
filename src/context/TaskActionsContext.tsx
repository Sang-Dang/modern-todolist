/* eslint-disable @typescript-eslint/require-await */

import { useReminders } from '@/context/RemindersContext'
import { api } from '@/utils/api'
import { taskInput, taskUpdateInputPartial } from '@/validation/task'
import { useContext, createContext } from 'react'
import toast from 'react-hot-toast'
import { type z } from 'zod'

type TaskActionsContextProviderProps = {
    children: React.ReactNode
}

const TaskActionsContext = createContext({
    create: async (_task: z.infer<typeof taskInput>): Promise<string> => {
        return ''
    },
    updatePartial: async (_id: string, _name: string, _value: unknown): Promise<boolean> => {
        return false
    },
    update: async (_task: z.infer<typeof taskUpdateInputPartial>): Promise<boolean> => {
        return false
    },
    remove: async (_id: string): Promise<boolean> => {
        return false
    }
})

export default function TaskActionsContextProvider({ children }: TaskActionsContextProviderProps) {
    const remindersContext = useReminders()

    const trpc = api.useContext()
    const { mutateAsync: createTaskAPI } = api.task.create.useMutation({
        onSettled: () => {
            void trpc.task.all.invalidate()
        },
        onSuccess: () => {
            toast.success('Task created')
        }
    })
    const { mutateAsync: updateTaskAPI } = api.task.update.useMutation({
        onSettled: () => {
            void trpc.task.all.invalidate()
        },
        onSuccess: () => {
            toast.success('Task updated')
        }
    })
    const { mutateAsync: deleteTaskAPI } = api.task.delete.useMutation({
        onSettled: () => {
            void trpc.task.all.invalidate()
        },
        onSuccess: () => {
            toast.success('Task deleted')
        }
    })

    async function create(task: z.infer<typeof taskInput>): Promise<string> {
        if (!taskInput.safeParse(task).success) {
            throw new Error('Invalid task name')
        }

        const response = await createTaskAPI(task)

        if (response.reminders) {
            remindersContext.add(response, remindersContext.callbacks.taskReminderCallback)
        }

        return response.id
    }

    async function updatePartial(id: string, name: string, value: unknown): Promise<boolean> {
        const object = {
            id,
            [name]: value
        }

        if (!taskUpdateInputPartial.safeParse(object).success) {
            throw new Error('Invalid task update')
        }

        const response = await updateTaskAPI(object)
        if (response.reminders) {
            remindersContext.update(id, response, remindersContext.callbacks.taskReminderCallback)
        }

        return true
    }

    async function update(task: z.infer<typeof taskUpdateInputPartial>): Promise<boolean> {
        if (!taskInput.safeParse(task).success) {
            throw new Error('Invalid task name')
        }

        const response = await updateTaskAPI(task)
        if (response.reminders) {
            remindersContext.update(task.id, response, remindersContext.callbacks.taskReminderCallback)
        }

        return true
    }

    async function remove(id: string): Promise<boolean> {
        const response = await deleteTaskAPI({ id })
        if (response.reminders) {
            remindersContext.remove(id)
        }

        return true
    }

    return <TaskActionsContext.Provider value={{ create, updatePartial, update, remove }}>{children}</TaskActionsContext.Provider>
}

export function useTaskActions() {
    const context = useContext(TaskActionsContext)
    if (context === undefined) {
        throw new Error('useTaskActions must be used within a TaskActionsContextProvider')
    }
    return context
}
