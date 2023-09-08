import { IncomingMessage } from "http";

export interface CtxOrReq {
    req?: IncomingMessage;
    ctx?: { req: IncomingMessage };
}

// fetch data from api and forward cookies if this is called from the server
export async function fetchData<T = any>(
    path: string,
    cookie?: string | null //IncomingHeaders
): Promise<T | any> {

    const url = process.env.NEXT_PUBLIC_HUB_URL + path;
    try {
        console.log(cookie)
        const options = cookie ? { headers: { cookie: cookie } } : {};
        const res = await fetch(url, {
            credentials: 'include',
            //...options,
            cache: 'no-store'
        })
        const data = await res.json()
        if (!res.ok) throw data
        return Object.keys(data).length > 0 ? data : null // Return null if data empty
    } catch (err) {
        console.error('fetch data error', err)
        return null
    }
}