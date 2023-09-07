"use client";
import { Submission } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import {
  VoteActionProps,
  useVoteActionContext,
} from "@/providers/VoteActionProvider";
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import { sub } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { HiCheckBadge, HiPlus } from "react-icons/hi2";

// const Modal = ({
//   isModalOpen,
//   children,
//   onClose,
//   title,
// }: {
//   isModalOpen: boolean;
//   children: React.ReactNode;
//   onClose: () => void;
//   title?: string;
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [modalRef]);

//   if (isModalOpen) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
//         <div className="modal modal-open bg-transparent ">
//           <div
//             ref={modalRef}
//             className="modal-box max-w-[80vw] w-full overflow-hidden bg-transparent p-0"
//           >
//             {children}
//           </div>
//         </div>
//         <div className="fixed inset-0 bg-black opacity-50"></div>
//       </div>
//     );
//   }
//   return null;
// };

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
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-4xl animate-springUp"
        >
          {children}
        </div>
      </div>
    );
  }
  return null;
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
};

const AddToCartButton = ({ submission }: { submission: Submission }) => {
  const { addProposedVote, currentVotes, proposedVotes } =
    useVoteActionContext();
  const { contestState } = useContestState();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (currentVotes && proposedVotes) {
      setIsSelected(
        [...currentVotes, ...proposedVotes].some(
          (vote) => vote.submissionId === submission.id
        )
      );
    }
  }, [currentVotes, proposedVotes, submission.id]);

  const handleSelect = () => {
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  if (contestState === "voting") {
    if (isSelected) {
      return (
        <button className=" btn btn-ghost btn-sm cursor-default no-animation ml-auto">
          <HiCheckBadge className="h-6 w-6 text-black" />
        </button>
      );
    } else
      return (
        <button
          className=" btn btn-ghost btn-sm ml-auto"
          onClick={handleSelect}
        >
          <HiPlus className="h-6 w-6 text-black" />
        </button>
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
  const { contestState } = useContestState();
  const voteActions = useVoteActionContext();

  return (
    <Modal isModalOpen={true} onClose={() => router.back()}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={variants}
          //custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.1 },
          }}
          className="flex w-full h-[500px] lg:h-[650px] gap-1 lg:gap-4 p-0"
        >
          <div className="flex flex-col jusitfy-start w-full h-full">
            <ExpandedSubmission
              submission={submission}
              headerChildren={<AddToCartButton submission={submission} />}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}

const PreviewSubmission = ({ submission }: { submission: any }) => {
  if (submission.type === "text") {
    return <p>{submission.title}</p>;
  }
};
