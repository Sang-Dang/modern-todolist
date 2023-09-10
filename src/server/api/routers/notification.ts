/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import getNovu from '@/lib/novu/_novu'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

const novu = getNovu()

export const notificationRouter = createTRPCRouter({
    createSubscriber: protectedProcedure.mutation(async ({ ctx }) => {
        const { id, name, email } = ctx.session.user

        console.log(ctx.session.user)

        const result = await novu.subscribers.identify(id, {
            email: email!,
            firstName: name!
        })

        return result.status === 201
    })
})
