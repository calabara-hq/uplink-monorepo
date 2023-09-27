"use client";
import { Submission } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import { AddToCartButton } from "@/ui/Submission/SubmissionDisplay";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
      <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
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

export const ModalAddToCart = ({ submission }: { submission: Submission }) => {
  const voteActions = useVoteActionContext();
  const { contestState } = useContestState();

  if (contestState === "voting") {
    return (
      <AddToCartButton submission={submission} voteActions={voteActions} />
    );
  }
  return null;
};

export default function SubmissionModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Modal isModalOpen={true} onClose={() => router.back()}>
      {children}
    </Modal>
  );
}
