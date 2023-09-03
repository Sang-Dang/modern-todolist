/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
// DO NOT ENABLE. NULL AND UNDEFINED ARE DIFFERENT....

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { taskCompleteInput, taskDeleteInput, taskInput, taskUpdateInputPartial } from '@/validation/task'

export const taskRouter = createTRPCRouter({
    create: protectedProcedure.input(taskInput).mutation(async ({ ctx, input }) => {
        const currentDate = new Date()
        return await ctx.prisma.task.create({
            data: {
                name: input.name,
                description: input.description ?? '',
                dueDate: input.dueDate ?? null,
                ownerId: ctx.session.user.id,
                reminders: input.reminderDate ? [input.reminderDate] : [],
                createdAt: currentDate,
                updatedAt: currentDate
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
    }),
    update: protectedProcedure.input(taskUpdateInputPartial).mutation(async ({ ctx, input }) => {
        const existingTask = await ctx.prisma.task.findUnique({
            where: {
                id: input.id,
                ownerId: ctx.session.user.id
            }
        })

        if (!existingTask) {
            throw new Error('Task not found')
        }

        return await ctx.prisma.task.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name === undefined ? existingTask.name : input.name,
                description: input.description === undefined ? existingTask.description : input.description,
                dueDate: input.dueDate === undefined ? existingTask.dueDate : input.dueDate,
                updatedAt: new Date()
            }
        })
    })
})
