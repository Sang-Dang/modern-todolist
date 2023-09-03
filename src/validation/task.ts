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

export const taskUpdateInput = z.object({
    id: z.string().cuid(),
    name: z.string().min(1),
    description: z.string().nullable(),
    dueDate: z.date().nullable(),
    reminders: z.array(z.date())
})

// optional: don't update in database
// nullable: set db value to null
export const taskUpdateInputPartial = z.object({
    id: z.string().cuid(),
    name: z.string().min(1, 'Name cannot be empty.').optional(),
    description: z.string().optional().nullable(),
    dueDate: z.date().optional().nullable()
})
