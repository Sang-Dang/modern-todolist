/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState } from 'react'
import schedule from 'node-schedule'
import { type Task } from '@prisma/client'
import { isBefore } from 'date-fns'

type RemindersContextProviderProps = {
    children: React.ReactNode
}

const RemindersContext = createContext({
    add: (task: Task, callback: (task: Task) => void) => {
        /** */
    },
    remove: (id: string) => {
        /** */
    }
})

export default function RemindersContextProvider({ children }: RemindersContextProviderProps) {
    const [reminders, setReminders] = useState<Map<string, schedule.Job>>(new Map())

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

    // function addReminders() {}

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

    // function updateReminder() {}

    return <RemindersContext.Provider value={{ add, remove }}>{children}</RemindersContext.Provider>
}

export function useReminders() {
    const context = useContext(RemindersContext)
    if (context === undefined) {
        throw new Error('useReminders must be used within a RemindersContextProvider')
    }
    return context
}
