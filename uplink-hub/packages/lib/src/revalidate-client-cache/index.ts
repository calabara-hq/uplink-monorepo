import axios from 'axios';


// revalidate the nextjs cache by sending a POST request to the /api/revalidate route with the tags to revalidate


export const revalidateClientCache = async ({ host, secret, tags }: {
    host: string,
    secret: string,
    tags: string[]
}) => {
    try {
        const revalResult = await axios.post(`${host}/api/revalidate`, {
            tags: tags
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secret
                }
            })
        return revalResult
    } catch (err) {
        console.log(err)
    }
}
