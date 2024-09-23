"use client";;
import {
    HiPlus,
} from "react-icons/hi2";
import { Modal } from "../Modal/Modal";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/DesignKit/Button";
import { DialogDescription, DialogHeader, DialogTitle } from "../DesignKit/Dialog";
import { Space } from "@/types/space";
import { handleV2Error } from "@/lib/fetch/handleV2Errors";
import useSWR from "swr";


const fetchUserManagedSpaces = async (userAddress: string): Promise<Space[]> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/userManagedSpaces?userAddress=${userAddress}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(handleV2Error)

    return data;
}

export const useManagedSpaces = (userAddress?: string, refreshInterval?: number) => {

    const swrKey = userAddress ? `/swrUserManagedSpaces/${userAddress}` : null;

    const {
        data: managedSpaces,
        isLoading,
        error,
        mutate,
    }: { data: Space[]; isLoading: boolean; error: any; mutate: any } = useSWR(
        swrKey,
        () => fetchUserManagedSpaces(userAddress),
        { refreshInterval: refreshInterval ?? 0 }
    );

    return {
        managedSpaces,
        isLoading,
        error,
        mutateSwrManagedSpaces: mutate
    }
}



export const NewButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                draggable={false}
                onClick={() => setIsModalOpen(true)}
                className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto
          hover:bg-base-300 bg-base-100 text-primary hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
            >
                <HiPlus className="h-6 w-6" />
                <span
                    className="absolute flex items-center justify-center z-10 bg-base-300 border border-border w-auto p-2 m-2 min-w-max left-14 normal-case
            text-t1 text-sm font-bold rounded-md shadow-md transition-all duration-300 scale-0 origin-left group-hover:scale-100"
                >
                    <p>New</p>
                </span>
            </div>

            <Modal
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="w-full max-w-[450px]"
            >
                <div className="flex flex-col gap-6 animate-springUp">
                    <DialogHeader>
                        <DialogTitle>New Space</DialogTitle>
                        <DialogDescription>
                            Create a new space to host contests and mintboards for your community.
                        </DialogDescription>
                    </DialogHeader>
                    <Link href="/spacebuilder/create" passHref className="w-fit">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Create a new space
                        </Button>
                    </Link>
                </div>
            </Modal>
        </>
    );
};