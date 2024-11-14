"use client";;
import { useState } from "react";
import CardSubmission from "./CardSubmission";
import { Submission } from "@/types/submission";
import { ShareButton, ShareModalContent } from "@/app/(legacy)/submission/[submissionId]/client";
import ExpandedSubmission from "./ExpandedSubmission";
import { Modal } from "../../../../ui/Modal/Modal";

export const SubmissionDisplaySkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <div className="w-10/12 sm:w-full m-auto grid gap-4 submission-columns auto-rows-fr">
          <div className="space-y-2 border-border border p-2 rounded-xl h-[480px] shimmer">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
          <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[480px] shimmer">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
          <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[480px] shimmer">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
          <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[480px] shimmer">
            <div className="h-5 w-2/3 rounded-lg bg-base-100" />
            <div className="h-3 w-1/3 rounded-lg bg-base-100" />
            <div className="h-4 w-3/4 rounded-lg bg-base-100" />
          </div>
        </div>
      </div>
    </div>
  );
};



const HeaderButtons = ({ submission, referrer, context }: { submission: Submission, referrer: string | null, context: string | null }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleClose = () => {
    setIsShareModalOpen(false);
  }

  return (
    <div className="flex gap-2 ml-auto items-center">
      <ShareButton submission={submission} onClick={() => setIsShareModalOpen(true)} context={context} />
      <Modal isModalOpen={isShareModalOpen} onClose={handleClose} >
        {isShareModalOpen && (
          <ShareModalContent submission={submission} handleClose={handleClose} context={context} />
        )}

      </Modal>
    </div>
  )
}

export const LiveSubmissionDisplay = ({
  contestId,
  submissions
}: {
  contestId: string;
  submissions: Array<Submission>;
}) => {

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const [submission, setSubmission] = useState<Submission | null>(null);


  const openShareModal = (submission: Submission) => {
    setIsShareModalOpen(true)
    setSubmission(submission)
  }

  const openExpandModal = (submission: Submission) => {
    setIsExpandModalOpen(true)
    setSubmission(submission)
  }

  const handleShare = (event, submission) => {
    event.stopPropagation();
    event.preventDefault();
    openShareModal(submission);
  }

  const handleClose = () => {
    setIsShareModalOpen(false)
    setIsExpandModalOpen(false)
    setIsManageModalOpen(false);
    setSubmission(null);
  }


  const handleExpand = (submission) => {
    openExpandModal(submission)
  }


  // base64 the contestId
  const context = Buffer.from(encodeURIComponent(`/contest/${contestId}`)).toString('base64')

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <div className="w-10/12 sm:w-full m-auto grid gap-4 submission-columns auto-rows-fr">
          {submissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                interactive={true}
                submission={submission}
                handleCardClick={(submission) => handleExpand(submission)}
                footerChildren={
                  <div className="flex flex-col w-full">
                    <div className="p-2 w-full" />
                    <div className="flex gap-2 w-full items-center">
                      <div>
                        <ShareButton submission={submission} onClick={(event) => handleShare(event, submission)} context={context} />
                      </div>
                    </div>
                  </div>
                }

              />
            );
          })}
        </div>
      </div>
      <Modal className="w-full max-w-[800px] h-full max-h-[700px] overflow-y-scroll" isModalOpen={isShareModalOpen || isExpandModalOpen || isManageModalOpen} onClose={handleClose} >
        {isShareModalOpen && submission && (
          <ShareModalContent submission={submission} handleClose={handleClose} context={context} />
        )}

        {isExpandModalOpen && submission && (
          <ExpandedSubmission submission={submission} headerChildren={
            <HeaderButtons submission={submission} referrer={null} context={context} />
          } />
          // </div>
        )}
      </Modal>
    </div >
  );
};

