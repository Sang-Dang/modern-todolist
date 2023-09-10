/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import getNovu from '@/lib/novu/_novu'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { notifyInput } from '@/validation/notification'

const novu = getNovu()

export const notificationRouter = createTRPCRouter({
    createSubscriber: protectedProcedure.mutation(async ({ ctx }) => {
        const { id, name, email } = ctx.session.user

        const result = await novu.subscribers.identify(id, {
            email: email!,
            firstName: name!
        })

        return result.status === 201
    }),
    remindSelf: protectedProcedure.input(notifyInput).mutation(async ({ ctx, input }) => {
        const { taskId, name } = input

        const result = await novu.trigger('remind', {
            to: {
                subscriberId: ctx.session.user.id
            },
            payload: {
                taskId,
                name
            }
        })

        return result.status === 200
    })
})
