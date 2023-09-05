import { env } from '@/env.mjs'
import { Novu } from '@novu/node'

export default function getNovu() {
    return new Novu(env.NOVU_API_KEY)
}
