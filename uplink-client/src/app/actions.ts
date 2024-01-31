'use server';
import { revalidateTag } from "next/cache";
import FormData from 'form-data';
import axios from 'axios';


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

export async function uploadMedia(data: FormData) {
        
    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`,
            },
        });

        return `https://uplink.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}