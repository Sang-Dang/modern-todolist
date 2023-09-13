/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
// DO NOT ENABLE. NULL AND UNDEFINED ARE DIFFERENT....

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { allInput, taskDeleteInput, taskInput, taskUpdateInputPartial } from '@/validation/task'
import { type Task } from '@prisma/client'

export const taskRouter = createTRPCRouter({
    create: protectedProcedure.input(taskInput).mutation(async ({ ctx, input }) => {
        const currentDate = new Date()
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
        return result
    }),
    all: protectedProcedure.input(allInput).query(async ({ ctx, input }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let whereVal = {} as { [keyof in keyof Omit<Task, 'ownerId' | 'completed'>]?: any }
        switch (input.fetchType) {
            case 'starred': {
                whereVal = {
                    starred: true
                }
                break
            }
            case 'today': {
                const todayBefore = new Date()
                const todayAfter = new Date()

                todayBefore.setHours(0, 0, 0, 0)
                todayAfter.setHours(23, 59, 59, 999)

                whereVal = {
                    dueDate: {
                        gte: todayBefore,
                        lte: todayAfter
                    }
                }
                break
            }
            case 'planned': {
                whereVal = {
                    dueDate: {
                        not: null
                    }
                }
                break
            }
        }

        const incompleted = await ctx.prisma.task.findMany({
            where: {
                ownerId: ctx.session.user.id,
                completed: false,
                ...whereVal
            }
        })

        const completed = await ctx.prisma.task.findMany({
            where: {
                ownerId: ctx.session.user.id,
                completed: true,
                ...whereVal
            }
        })

        return {
            incompleted,
            completed
        }
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
