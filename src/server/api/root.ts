import { exampleRouter } from '@/server/api/routers/example'
import { createTRPCRouter } from '@/server/api/trpc'
import { taskRouter } from './routers/task'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    example: exampleRouter,
    task: taskRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
