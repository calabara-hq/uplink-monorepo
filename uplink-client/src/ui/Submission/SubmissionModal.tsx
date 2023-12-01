"use client";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const MintSubmissionModal = ({ isModalOpen, onClose, children }) => {
  if (isModalOpen) {
    return ReactDOM.createPortal(
      <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
        <div
          className="modal-box bg-black border border-[#ffffff14] animate-springUp max-w-4xl"
        >
          {children}
        </div>
      </div>
      , document.body);
  }
  return null;
}

const ShareSubmissionModal = ({ isModalOpen, onClose, children }) => {
  if (isModalOpen) {
    return ReactDOM.createPortal(
      <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
        <div
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-xl animate-springUp"
        >
          {children}
        </div>
      </div>
      , document.body);
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
  handleClose: () => void;
  mode: "mint" | "share";
  children: React.ReactNode;
}) {

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

  return null;

}
