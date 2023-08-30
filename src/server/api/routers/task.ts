import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { taskInput } from '@/validation/task'

export const taskRouter = createTRPCRouter({
    create: protectedProcedure.input(taskInput).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.task.create({
            data: {
                name: input.name,
                description: input.description ?? '',
                ownerId: ctx.session.user.id
            }
        })
    }),
    all: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.task.findMany({
            where: {
                ownerId: ctx.session.user.id
            }
        })
    })
})
