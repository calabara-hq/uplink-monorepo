"use client"

import { toast } from "react-hot-toast"

export const handleV2MutationError = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            return toast.error("You are not authorized to perform this action")
        }
        else if (response.status === 400) {
            return toast.error("Invalid arguments")
        }
        else {
            return toast.error("Something went wrong")
        }
    }
    else {
        return response.json()
    }

}