import { createTRPCRouter } from '@/server/api/trpc'
import { taskRouter } from './routers/task'
import { notificationRouter } from '@/server/api/routers/notification'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    task: taskRouter,
    notification: notificationRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
