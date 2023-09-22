import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const { tags, secret } = requestData;
        if (secret !== process.env.API_SECRET) throw new Error('Invalid secret')
        console.log(tags)
        for (const tag of tags) { revalidateTag(tag) }

        return NextResponse.json({ revalidated: true, now: Date.now() })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ revalidated: false, now: Date.now() })
    }
}