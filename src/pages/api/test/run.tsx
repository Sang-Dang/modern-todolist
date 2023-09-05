import { deleteSubscriber } from '@/lib/novu/general'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    void deleteSubscriber('100121468402727749028')
    void deleteSubscriber('clm4obl3z0000nxugnou1t073')
    void deleteSubscriber('108960798914708831384')
    void deleteSubscriber('clm4otell000bnxughydq3163')
    void deleteSubscriber('clm4pgim1000knxugyv8hy9x3')
    void deleteSubscriber('clm4ppzef0000nxyk3zdgf66i')

    res.status(200).json({ message: 'Hello from Next.js!' })
}
