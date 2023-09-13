import { type Task } from '@prisma/client'
import isBefore from 'date-fns/isBefore'
import schedule from 'node-schedule'

const scheduledJobs = new Map()

export function scheduleReminders(tasks: Task[], callback: (task: Task) => void) {
    tasks.forEach((task) => {
        if (task.reminders && !scheduledJobs.has(task.id)) {
            const job = schedule.scheduleJob(task.reminders, function () {
                callback(task)
                cancelReminder(task)
            })
            scheduledJobs.set(task.id, job)
        }
    })
}

export function scheduleReminder(task: Task, callback: (task: Task) => void): boolean {
    if (task.reminders && !scheduledJobs.has(task.id)) {
        if (isBefore(task.reminders, new Date())) {
            return false
        }

        const job = schedule.scheduleJob(task.reminders, function () {
            callback(task)
            cancelReminder(task)
        })
        scheduledJobs.set(task.id, job)
        return true
    }
    return false
}

export function cancelReminder(task: Task) {
    const job = scheduledJobs.get(task.id)
    if (job) {
        job.cancel()
        scheduledJobs.delete(task.id)
        return true
    } else {
        return false
    }
}
