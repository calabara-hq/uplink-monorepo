"use client";
import { useContestState } from "@/providers/ContestStateProvider";
import { useState, useEffect } from "react";
import { DetailsSkeleton } from "@/ui/ContestDetails/ContestDetails";
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
        <div className="flex flex-col gap-2 border border-border rounded-lg w-full">
            {isVoting &&
                <div className="flex flex-col gap-2 p-2">
                    <div className="w-full grid grid-cols-2 gap-2">
                        <button className={`btn normal-case btn-ghost ${tab === 0 && 'btn-active'}`} onClick={() => setTab(0)}>Details</button>
                        <button className={`btn normal-case btn-ghost ${tab === 1 && 'btn-active'}`} onClick={() => setTab(1)}>Vote</button>
                    </div>
                    <div className="bg-base-200 w-full h-0.5 rounded-lg" />
                </div>
            }
            {tab === 0 && detailsChild}
            {tab === 1 && voteChild}
        </div>
    )
}

export default ContestSidebar;