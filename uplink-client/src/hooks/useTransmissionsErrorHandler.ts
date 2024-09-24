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

            if (err.includes("NotAcceptingMints()")) {
                toast.error("This channel is not accepting mints")
            }

            if (err.includes("NotAcceptingCreations()")) {
                toast.error("This channel is not accepting new posts")
            }

            if (err.includes("InvalidRewards()")) {
                toast.error("Invalid rewards")
            }

            if (err.includes("InvalidAmountSent()")) {
                toast.error("Invalid amount sent")
            }

            if (err.includes("AlreadySettled()")) {
                toast.error("This contest has already been settled")
            }

            if (err.includes("InsufficientInteractionPower()")) {
                toast.error("Insufficient interaction credits")
            }

        }
    }, [error])

}