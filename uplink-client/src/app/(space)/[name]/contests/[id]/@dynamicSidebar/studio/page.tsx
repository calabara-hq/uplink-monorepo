"use client";
import { useContestInteractionContext } from "@/providers/ContestState";
import { handleSubmit } from "../../studio/studioHandler";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateSubmissionDocument } from "@/lib/graphql/submit.gql";

/**
 *
 * the studio submit button for the studio view
 *
 */

const StudioSubmitButton = ({
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
  const {
    userSubmission,
    setSubmissionField,
    setSubmissionErrors,
    resetSubmission,
  } = useContestInteractionContext();

  const handleMutation = useHandleMutation(CreateSubmissionDocument);

  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
      <button
        onClick={() =>
          handleSubmit({
            state: userSubmission,
            setSubmissionField,
            setSubmissionErrors,
            handleMutation,
            contestId: contestId,
          })
        }
        className="btn btn-primary flex flex-1"
      >
        Submit
      </button>
      <p className="mx-2 p-2 text-center">4 days</p>
    </div>
  );
};

const Submitting = ({
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
        <StudioSubmitButton spaceName={spaceName} contestId={contestId} />
      </div>
    </div>
  );
};

export default function Page({
  params,
}: {
  params: { name: string; id: string };
}) {
  return <Submitting spaceName={params.name} contestId={parseInt(params.id)} />;
}
