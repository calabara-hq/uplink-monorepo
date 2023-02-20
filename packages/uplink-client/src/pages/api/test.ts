
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('INSIDE TEST HANDLER')
    console.log(JSON.stringify(req.headers));
    const token = await getToken({ req })

    console.log('TOKEN  from test route IS', token)
    res.send({ data: 'NOT IMPLEMENTED' })
}