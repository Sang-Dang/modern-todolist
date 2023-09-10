import { z } from 'zod'

export const notifyInput = z.object({
    taskId: z.string().cuid(),
    name: z.string()
})
