import { z } from 'zod'

export const taskInput = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.date().optional(),
    reminderDate: z.date().optional()
})

export const taskCompleteInput = z.object({
    id: z.string().cuid(),
    completed: z.boolean()
})

export const taskDeleteInput = z.object({
    id: z.string().cuid()
})
