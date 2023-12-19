"use client";
import { useRouter } from "next/navigation";

const MintSubmissionModal = ({ isModalOpen, onClose, children }: { isModalOpen: boolean, onClose: () => void, children: React.ReactNode }) => {

  if (isModalOpen) {
    return (
      <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
        <div
          className="modal-box bg-black border border-[#ffffff14] animate-springUp max-w-4xl"
        >
          {children}
        </div>
      </div>
      );
  }
  return null;
}


const ExpandSubmissionModal = ({ isModalOpen, onClose, children }: { isModalOpen: boolean, onClose: () => void, children: React.ReactNode }) => {

  if (isModalOpen) {

    return (
      <div className="modal modal-open bg-black  transition-colors duration-500 ease-in-out w-[100vw]">
        <div
          className="modal-box bg-black animate-springUp max-w-full h-[100vh] overflow-y-scroll"
        >
          {children}
        </div>
      </div>
      );
  }
  return null;
}

const ShareSubmissionModal = ({ isModalOpen, onClose, children }: { isModalOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (isModalOpen) {
    return (
      <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
        <div
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-xl animate-springUp"
        >
          {children}
        </div>
      </div>
      );
  }
  return null;
}


export default function SubmissionModal({
  isModalOpen,
  handleClose,
  mode,
  children,
}: {
  isModalOpen: boolean;

  mode: "mint" | "share" | "expand";
  children: React.ReactNode;
  handleClose?: () => void;
}) {

  const router = useRouter();

  if (mode === "mint") {
    return (
      <MintSubmissionModal isModalOpen={isModalOpen} onClose={handleClose}>
        {children}
      </MintSubmissionModal>
    );
  }

  if (mode === "share") {
    return (
      <ShareSubmissionModal isModalOpen={isModalOpen} onClose={handleClose}>
        {children}
      </ShareSubmissionModal>
    )
  }

  if (mode === "expand") {
    return (
      <ExpandSubmissionModal isModalOpen={isModalOpen} onClose={handleClose}>
        {children}
      </ExpandSubmissionModal>
    )
  }

  return null;

}
