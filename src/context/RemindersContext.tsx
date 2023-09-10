/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState } from 'react'
import schedule from 'node-schedule'
import { type Task } from '@prisma/client'
import { isBefore } from 'date-fns'
import { getDateDifference } from '@/utils/helper'
import toast from 'react-hot-toast'
import { api } from '@/utils/api'

type RemindersContextProviderProps = {
    children: React.ReactNode
}

const RemindersContext = createContext({
    add: (_task: Task, _callback: (task: Task) => void) => {
        /** */
    },
    remove: (_id: string) => {
        /** */
    },
    addMany: (_tasks: Task[], _callback: (task: Task) => void): { succeeded: number; failed: number } => {
        return { succeeded: 0, failed: 0 }
    },
    update: (_id: string, _task: Task, _callback: (task: Task) => void) => {
        /** */
    },
    callbacks: {
        taskReminderCallback: (_task: Task) => {
            /** */
        }
    }
})

export default function RemindersContextProvider({ children }: RemindersContextProviderProps) {
    const [reminders, setReminders] = useState<Map<string, schedule.Job>>(new Map())

    const { mutate: remind } = api.notification.remindSelf.useMutation()

    function taskReminderCallback(task: Task) {
        if (task.dueDate) {
            const { days, hours, minutes, seconds } = getDateDifference(task.dueDate, new Date())

            remind({ taskId: task.id, name: task.name })
            toast.success(
                `Your task "${task.name}" is due in ${
                    days !== 0 ? `${days} days` : hours !== 0 ? `${hours} hours` : minutes !== 0 ? `${minutes} minutes` : `${seconds} seconds`
                }`
            )
        } else {
            toast.success(`This is a reminder for: "${task.name}"!`)
        }
    }

    function add(task: Task, callback: (task: Task) => void): boolean {
        if (task.reminders && !reminders.has(task.id)) {
            if (isBefore(task.reminders, new Date())) {
                return false
            }

            const job = schedule.scheduleJob(task.reminders, function () {
                callback(task)
                remove(task.id)
            })
            setReminders((prev) => {
                prev.set(task.id, job)
                return prev
            })
            return true
        }
        return false
    }

    function addMany(tasks: Task[], callback: (task: Task) => void): { succeeded: number; failed: number } {
        let succeeded = 0,
            failed = 0

        tasks.forEach((task) => {
            const result = add(task, callback)
            if (result) {
                succeeded++
            } else {
                failed++
            }
        })

        return { succeeded, failed }
    }

    function remove(id: string) {
        const job = reminders.get(id)
        if (job) {
            job.cancel()
            setReminders((prev) => {
                prev.delete(id)
                return prev
            })
            return true
        } else {
            return false
        }
    }

    function update(id: string, task: Task, callback: (task: Task) => void) {
        remove(id)
        add(task, callback)
    }

    return (
        <RemindersContext.Provider value={{ add, remove, addMany, update, callbacks: { taskReminderCallback } }}>
            {children}
        </RemindersContext.Provider>
    )
}

export function useReminders() {
    const context = useContext(RemindersContext)
    if (context === undefined) {
        throw new Error('useReminders must be used within a RemindersContextProvider')
    }
    return context
}
