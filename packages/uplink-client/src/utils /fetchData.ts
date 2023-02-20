import { IncomingMessage } from "http";

export interface CtxOrReq {
    req?: IncomingMessage;
    ctx?: { req: IncomingMessage };
}


export async function fetchData<T = any>(
    path: string,
    cookie?: string | null //IncomingHeaders
): Promise<T | any> {
    const url = process.env.NEXT_PUBLIC_HUB_URL + path;
    try {
        console.log('HELLO FROM FETCH DATA')
        console.log(cookie)
        const options = cookie ? { headers: { cookie: cookie } } : {};
        //console.log(options)
        //console.log('REQ', req)
        const res = await fetch(url, {
            credentials: 'include',
            ...options,
        })
        const data = await res.json()
        if (!res.ok) throw data
        return Object.keys(data).length > 0 ? data : null // Return null if data empty
    } catch (err) {
        console.error('fetch data error', err)
        return null
    }
}