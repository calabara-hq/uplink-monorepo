"use client";
import { useContestState } from "@/providers/ContestStateProvider";
import { useState, useEffect } from "react";
import { DetailsSkeleton } from "@/ui/ContestDetails/ContestDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../DesignKit/Tabs";
const ContestSidebar = ({ detailsChild, voteChild }: { detailsChild: React.ReactNode, voteChild: React.ReactNode }) => {

    // const { contestState } = useContestState();
    const [isVoting, setIsVoting] = useState(true);
    const [tab, setTab] = useState(0);

    // useEffect(() => {
    //     if (contestState) {
    //         if (contestState === "voting") {
    //             setTab(1)
    //             setIsVoting(true);
    //         }
    //         else {
    //             setTab(0)
    //             setIsVoting(false);
    //         }
    //     }
    // }, [contestState])

    // if (!contestState) return (
    //     <div className="flex flex-col gap-2 border border-border rounded-lg w-full">
    //         <DetailsSkeleton />
    //     </div>
    // )
    return (
        <div className="flex flex-col gap-2 w-full">
            {isVoting ?
                <Tabs defaultValue="vote">
                    <TabsList className="w-full h-12">
                        <TabsTrigger value="details" className="w-11/12 h-10">Details</TabsTrigger>
                        <TabsTrigger value="vote" className="w-11/12 h-10">Vote</TabsTrigger>
                    </TabsList>
                    <div className="border border-border bg-base-100 rounded-lg mt-2">
                        <TabsContent value="details">{detailsChild}</TabsContent>
                        <TabsContent value="vote">{voteChild}</TabsContent>
                    </div>
                </Tabs>
                : (
                    <div className="border border-border bg-base-100  rounded-lg mt-2">
                        {detailsChild}
                    </div>
                )}

        </div>
    )
}

export default ContestSidebar;