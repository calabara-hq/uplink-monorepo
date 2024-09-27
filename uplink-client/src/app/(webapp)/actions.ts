'use server';
import { revalidateTag } from "next/cache";

export async function revalidateDataCache(tags: string[]) {
    try {
        for (const tag of tags) {
            revalidateTag(tag);
        }
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}
