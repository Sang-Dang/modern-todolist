import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { taskCompleteInput, taskDeleteInput, taskInput } from '@/validation/task'

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
    }),
    delete: protectedProcedure.input(taskDeleteInput).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.task.delete({
            where: {
                id: input.id,
                ownerId: ctx.session.user.id
            }
        })
    }),
    toggleComplete: protectedProcedure.input(taskCompleteInput).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.task.update({
            where: {
                id: input.id,
                ownerId: ctx.session.user.id
            },
            data: {
                completed: input.completed,
                updatedAt: new Date()
            }
        })
    })
})
