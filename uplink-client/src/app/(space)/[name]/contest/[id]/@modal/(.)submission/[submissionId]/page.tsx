"use client";
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import SubmissionModal, { ModalAddToCart } from "./submissionModal";
import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission";
import { Suspense } from "react";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";

export default async function SubmissionPage({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  //const submissions = fetchSingleSubmission(submissionId);
  const { liveSubmissions } = useLiveSubmissions(id);
  const submission = liveSubmissions?.find(
    (submission) => submission.id === submissionId
  );

  if(!submission) return null;

  return (
    <SubmissionModal>
      <div className="flex w-full gap-1 lg:gap-4 p-0">
        <div className="flex flex-col jusitfy-start w-full h-full ">
          <ExpandedSubmission
            submission={submission}
            headerChildren={
              <div className="flex p-1 ml-auto items-center justify-center">
                <ModalAddToCart submission={submission} />
              </div>
            }
          />
        </div>
      </div>
    </SubmissionModal>
  );
}
