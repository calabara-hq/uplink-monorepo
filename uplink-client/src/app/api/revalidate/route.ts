import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const runtime = 'edge';


const xor_compare = (a: string, b: string) => {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}



export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const { tags, secret } = requestData;
        
        if (!xor_compare(secret, process.env.API_SECRET)) throw new Error('Invalid secret')

        for (const tag of tags) { revalidateTag(tag) }

        return NextResponse.json({ revalidated: true, now: Date.now() })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ revalidated: false, now: Date.now() })
    }
}