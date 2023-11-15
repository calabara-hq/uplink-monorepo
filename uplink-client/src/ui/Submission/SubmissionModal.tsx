"use client";
import type { Submission } from "@/types/submission";
import { useContestState } from "@/providers/ContestStateProvider";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import { AddToCartButton } from "@/ui/Submission/SubmissionDisplay";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";


const ExpandSubmissionModal = ({
  isModalOpen,
  children,
  onClose,
  disableClickOutside,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  disableClickOutside?: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        disableClickOutside ? null : onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, disableClickOutside]);

  if (isModalOpen) {
    return ReactDOM.createPortal(
      <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
        <div
          ref={modalRef}
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-4xl h-full animate-springUp"
        >
          {children}
        </div>
      </div>
      , document.body);
  }
  return null;
};

const MintSubmissionModal = ({ isModalOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        null//onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  if (isModalOpen) {
    return ReactDOM.createPortal(
      <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
        <div
          ref={modalRef}
          className="modal-box bg-black border border-[#ffffff14] animate-springUp max-w-4xl"
        >
          {children}
        </div>
      </div>
      , document.body);
  }
  return null;
}

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
  isModalOpen,
  handleClose,
  mode,
  children,
}: {
  isModalOpen: boolean;
  handleClose: () => void;
  mode: "expand" | "mint";
  children: React.ReactNode;
}) {

  if (mode === "expand") {
    return (
      <ExpandSubmissionModal isModalOpen={isModalOpen} onClose={handleClose}>
        {children}
      </ExpandSubmissionModal>
    );
  }
  if (mode === "mint") {
    return (
      <MintSubmissionModal isModalOpen={isModalOpen} onClose={handleClose}>
        {children}
      </MintSubmissionModal>
    );
  }
  return null;

}
