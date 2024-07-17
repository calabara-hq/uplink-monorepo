import { notFound } from "next/navigation"

export const handleV2Error = async (response: Response) => {
    if (!response.ok) {
        const parsedResponse = await response.json();
        if (response.status === 404) {
            console.error(parsedResponse)
            notFound();
        }
        else {
            console.error(parsedResponse)
            return null;
        }
    }
    else {
        return response.json()
    }
}
