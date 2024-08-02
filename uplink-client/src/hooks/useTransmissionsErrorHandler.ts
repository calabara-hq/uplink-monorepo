"use client";
import { useEffect } from "react"
import { toast } from "react-hot-toast"

export const useTransmissionsErrorHandler = (error: any) => {

    useEffect(() => {
        if (error) {
            const err = error.toString();

            if (err.includes("Unauthorized()")) {
                toast.error("You are not authorized to perform this action")
            }

            if (err.includes("executing this transaction exceeds the balance")) {
                toast.error("Insufficient funds")
            }

        }
    }, [error])

}