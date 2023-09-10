/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
// DO NOT ENABLE. NULL AND UNDEFINED ARE DIFFERENT....

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { taskDeleteInput, taskInput, taskUpdateInputPartial } from '@/validation/task'
import { Task } from '@prisma/client'
import { z } from 'zod'

export const taskRouter = createTRPCRouter({
    create: protectedProcedure.input(taskInput).mutation(async ({ ctx, input }) => {
        const currentDate = new Date()
        console.log(input.reminders)
        const result = await ctx.prisma.task.create({
            data: {
                name: input.name,
                description: input.description ?? '',
                dueDate: input.dueDate ?? null,
                ownerId: ctx.session.user.id,
                reminders: input.reminders,
                starred: input.starred ?? false,
                completed: false,
                createdAt: currentDate,
                updatedAt: currentDate
            }
        })
        console.log(result)
        return result
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
                updatedAt: new Date(),
                reminders: input.reminders === undefined ? existingTask.reminders : input.reminders,
                completed: input.completed === undefined ? existingTask.completed : input.completed,
                starred: input.starred === undefined ? existingTask.starred : input.starred
            }
        })
    })
})
