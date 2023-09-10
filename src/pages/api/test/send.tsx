import getNovu from '@/lib/novu/_novu'
import { type NextApiRequest, type NextApiResponse } from 'next'

type ResponseData = {
    //
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const novu = getNovu()

    await novu.trigger('testnotification', {
        to: {
            subscriberId: 'clm6m9y230000nxh4g6ypbe8f'
        },
        payload: {}
    })

    res.send('ok')
}
