import { IncomingMessage } from "http";

export interface CtxOrReq {
    req?: IncomingMessage;
    ctx?: { req: IncomingMessage };
}

export async function fetchData<T = any>(
    path: string,
    { ctx, req = ctx?.req }: CtxOrReq = {}
): Promise<T | any> {
    const url = process.env.NEXT_PUBLIC_HUB_URL + path;
    try {
        //const options = req?.headers.cookie ? { headers: { cookie: req.headers.cookie } } : {};
        const res = await fetch(url, {
            credentials: 'include'
        })
        const data = await res.json()
        if (!res.ok) throw data
        return Object.keys(data).length > 0 ? data : null // Return null if data empty
    } catch (err) {
        console.error('fetch data error', err)
        return null
    }
}