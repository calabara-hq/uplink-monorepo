"use client";
import { Submission } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import {
  VoteActionProps,
  useVoteActionContext,
} from "@/providers/VoteActionProvider";
import { AddToCartButton } from "@/ui/Contests/SubmissionDisplay";
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import { sub } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { HiCheckBadge, HiPlus } from "react-icons/hi2";

const Modal = ({
  isModalOpen,
  children,
  onClose,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  if (isModalOpen) {
    return (
      <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-[#00000080] transition-colors duration-300 ease-in-out">
        <div
          ref={modalRef}
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-4xl h-full animate-springUp"
        >
          {children}
        </div>
      </div>
    );
  }
  return null;
};

export default function SubmissionModal({
  spaceName,
  contestId,
  submission,
  submissions,
  prevSubmission,
  nextSubmission,
  index,
}: {
  spaceName: string;
  contestId: string;
  submission: any;
  submissions: any;
  prevSubmission: any;
  nextSubmission: any;
  index: number;
}) {
  const router = useRouter();
  const voteActions = useVoteActionContext();
  return (
    <Modal isModalOpen={true} onClose={() => router.back()}>
      <AnimatePresence mode="wait">
        <div className="flex w-full gap-1 lg:gap-4 p-0">
          <div className="flex flex-col jusitfy-start w-full h-full ">
            <ExpandedSubmission
              submission={submission}
              headerChildren={
                <div className="p-1 ml-auto ">
                  <AddToCartButton
                    submission={submission}
                    voteActions={voteActions}
                  />
                </div>
              }
            />
          </div>
        </div>
      </AnimatePresence>
    </Modal>
  );
}
