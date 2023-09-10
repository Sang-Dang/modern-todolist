import { deleteSubscriber } from '@/lib/novu/general'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    void deleteSubscriber('<REPLACE_WITH_DATA>')

    res.status(200).json({ message: 'Hello from Next.js!' })
}
