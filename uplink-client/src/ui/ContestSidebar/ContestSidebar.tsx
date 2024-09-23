"use client";
import { useContestState } from "@/providers/ContestStateProvider";
import { useState, useEffect } from "react";
import { DetailsSkeleton } from "@/ui/ContestDetails/ContestDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../DesignKit/Tabs";

const ContestSidebar = ({ detailsChild, voteChild }: { detailsChild: React.ReactNode, voteChild: React.ReactNode }) => {

    const { contestState } = useContestState();
    const [isVoting, setIsVoting] = useState(false);
    const [tab, setTab] = useState(null);

    useEffect(() => {
        if (contestState) {
            if (contestState === "voting") {
                setTab(1)
                setIsVoting(true);
            }
            else {
                setTab(0)
                setIsVoting(false);
            }
        }
    }, [contestState])

    if (!contestState) return (
        <div className="flex flex-col gap-2 border border-border rounded-lg w-full">
            <DetailsSkeleton />
        </div>
    )
    return (
        <div className="flex flex-col gap-2 w-full border border-border bg-base-100 rounded-lg">
            {isVoting ?
                <Tabs defaultValue="vote">
                    <TabsList className="w-full h-12 flex gap-0.5">
                        <TabsTrigger value="details" className="w-11/12 h-10">Details</TabsTrigger>
                        <TabsTrigger value="vote" className="w-11/12 h-10">Vote</TabsTrigger>
                    </TabsList>
                    <div>
                        <TabsContent value="details">{detailsChild}</TabsContent>
                        <TabsContent value="vote">{voteChild}</TabsContent>
                    </div>
                </Tabs>
                : (
                    <div>
                        {detailsChild}
                    </div>
                )}

        </div>
    )
}

export default ContestSidebar;