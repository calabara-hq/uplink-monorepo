"use client";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/ui/Editor/Editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-base-100 h-[264px] shimmer rounded-xl" />
  ),
});
import type { OutputData } from "@editorjs/editorjs";
import useSWRMutation from "swr/mutation";
import {
  HiCheckBadge,
  HiXCircle,
  HiSparkles,
} from "react-icons/hi2";
import { useEffect, useState } from "react";
import { useSession } from "@/providers/SessionProvider";
import { BiInfoCircle } from "react-icons/bi";
import Modal from "@/ui/Modal/Modal";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { Decimal } from "decimal.js";
import { UserSubmissionParams, useContestInteractionApi } from "@/hooks/useContestInteractionAPI";
import {
  useStandardSubmissionCreator,
  SubmissionBuilderProps,
  validateSubmission
} from "@/hooks/useStandardSubmissionCreator";
import { handleMutationError } from "@/lib/handleMutationError";
import { HiBadgeCheck } from "react-icons/hi";
import Link from "next/link";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";
import LoadingDialog from "./loadingDialog";
import { useContestState } from "@/providers/ContestStateProvider";
import { MediaUpload } from "@/ui/MediaUpload/MediaUpload";
import { Boundary } from "@/ui/Boundary/Boundary";

async function postSubmission(
  url,
  {
    arg,
  }: {
    arg: {
      contestId: string;
      submission: {
        title: string;
        body: OutputData | null;
        previewAsset: string | null;
        videoAsset: string | null;
      };
      csrfToken: string | null;
    };
  }
) {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": arg.csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
      mutation Mutation($contestId: ID!, $submission: SubmissionPayload!) {
        createSubmission(contestId: $contestId, submission: $submission) {
          success
          submissionId
          userSubmissionParams {
              maxSubPower
              remainingSubPower
              userSubmissions {
                  type
              }
          }
        }
      }`,
      variables: {
        contestId: arg.contestId,
        submission: arg.submission,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.createSubmission);
}

const ErrorLabel = ({ error }: { error?: string }) => {
  if (error)
    return (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    );
  return null;
};

const SubmissionTitle = ({
  title,
  errors,
  setSubmissionTitle,
}: {
  title: string;
  errors: SubmissionBuilderProps["errors"];
  setSubmissionTitle: (val: string) => void;
}) => {
  const handleTitleChange = (e: any) => {
    setSubmissionTitle(e.target.value);
  };

  const handleTextareaResize = (e: any) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div>
      <div className="flex items-center">
        <label className="label">
          <span className="label-text text-t2">Title</span>
        </label>
        <p className="text-gray-500 text-sm text-right ml-auto">
          {`${title.length}/100`}
        </p>
      </div>

      <textarea
        rows={1}
        placeholder="What's happening?"
        className={`p-2 textarea textarea-lg resize-none w-full overflow-y-hidden ${errors?.title ? "textarea-error" : "textarea textarea-lg"
          }`}
        style={{ height: "auto" }}
        value={title}
        onChange={handleTitleChange}
        onInput={handleTextareaResize}
      />

      <ErrorLabel error={errors?.title} />
    </div>
  );
};

const SubmissionBody = ({
  submissionBody,
  errors,
  setSubmissionBody,
}: {
  submissionBody: SubmissionBuilderProps["submissionBody"];
  errors: SubmissionBuilderProps["errors"];
  setSubmissionBody: (val: OutputData) => void;
}) => {
  const editorCallback = (data: OutputData) => {
    setSubmissionBody(data);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm p-1 mb-2 text-t2">Body (optional)</label>
      <ErrorLabel error={errors?.submissionBody} />
      <Editor
        data={submissionBody ?? undefined}
        editorCallback={editorCallback}
      />
    </div>
  );
};

const StudioSidebar = ({
  state,
  contestId,
  setErrors,
  isUploading,
}: {
  state: SubmissionBuilderProps;
  contestId: string;
  setErrors: (errors: any) => void;
  isUploading: boolean;
}) => {
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } = useContestInteractionApi(contestId);
  const { stateRemainingTime } = useContestState();

  const { data: session, status } = useSession();
  const { mutateLiveSubmissions } = useLiveSubmissions(contestId);
  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    [`/api/userSubmitParams/${contestId}`, session?.user?.address],
    postSubmission,
    {
      onError: (err) => {
        console.log(err);
        reset();
      },
    }
  );

  const handleSubmit = async () => {
    const { payload, isError } = await validateSubmission(state, (data) => setErrors(data));

    if (isError) return;
    try {
      await trigger({
        contestId,
        submission: payload,
        csrfToken: session.csrfToken,
      });
      mutateLiveSubmissions();
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.log(err);
      reset();
    }
  };

  useEffect(() => {
    () => {
      return reset();
    }
  }, []);

  // userSubmitParams are undefined if the user is not logged in, if the contest is not in the submit window, or if the fetch hasn't finished yet
  // at this stage, we can assume that the contest is in the submit window.
  if (isLoading) {
    // waiting for results. show loading state
    return <div className="w-full bg-base-100 h-24 shimmer rounded-xl" />;
  } else {
    return (
      <div className="flex flex-col items-start w-full ml-auto">
        <label className="label">
          <span className="label-text text-t2">Eligibility</span>
        </label>
        <div className="flex flex-col bg-base-100 rounded-lg gap-4 w-full p-2">
          {userSubmitParams && (
            <div className="flex flex-col gap-2 items-start justify-center w-full p-2">
              <div className="flex flex-row gap-2 w-full">
                <p>entries remaining</p>
                <p className="ml-auto">{userSubmitParams.remainingSubPower}</p>
              </div>
              {userSubmitParams.restrictionResults.length > 0 && (
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex gap-2 items-center">
                    <p>satisfies restrictions?</p>
                    <BiInfoCircle
                      onClick={() => setIsRestrictionModalOpen(true)}
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                    />
                  </div>
                  {userSubmitParams.restrictionResults.some(
                    (el) => el.result === true
                  ) ? (
                    <HiCheckBadge className="ml-auto w-6 h-6 text-success" />
                  ) : (
                    <HiXCircle className="ml-auto w-6 h-6" />
                  )}
                </div>
              )}
              <div className="flex flex-row gap-2 w-full">
                <p>status</p>
                {parseInt(userSubmitParams.remainingSubPower) > 0 &&
                  new Decimal(userSubmitParams.maxSubPower).greaterThan(0) ? (
                  <p className="ml-auto">eligible</p>
                ) : (
                  <p className="ml-auto"> not eligible</p>
                )}
              </div>
            </div>
          )}
          <WalletConnectButton styleOverride="w-full btn-primary">
            <div className="flex flex-row items-center justify-between bg-base-200 rounded-lg gap-2 h-fit w-full">
              <button
                onClick={handleSubmit}
                className="btn btn-primary flex flex-1 normal-case"
                disabled={
                  !userSubmitParams ||
                  parseInt(userSubmitParams.remainingSubPower) <= 0 ||
                  isUploading ||
                  isMutating
                }
              >
                {isUploading ? (
                  <div className="flex gap-2 items-center">
                    <p className="text-sm">uploading media</p>
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    />
                  </div>
                ) : isMutating ? (
                  <div className="flex gap-2 items-center">
                    <p className="text-sm">Submitting</p>
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <p className="mx-2 p-2 text-center">{stateRemainingTime}</p>
            </div>
          </WalletConnectButton>
        </div>
        <RestrictionModal
          isModalOpen={isRestrictionModalOpen}
          handleClose={() => setIsRestrictionModalOpen(false)}
          userSubmitParams={userSubmitParams}
        />
        {isSuccessModalOpen && data && data.success && (
          <SuccessModal contestId={contestId} submissionId={data.submissionId} isDroppable={Boolean(state.previewAsset)} />
        )}
      </div>
    );
  }
};

const SuccessModal = ({ submissionId, isDroppable, contestId }) => {
  return (
    <div className="modal modal-open bg-black transition-colors duration-500 ease-in-out">
      <div
        className="modal-box bg-black border border-[#ffffff14] animate-springUp max-w-xl"
      >
        <div className="flex flex-col items-center justify-center gap-6 p-2 w-10/12 m-auto rounded-xl">
          <HiBadgeCheck className="w-32 h-32 text-success" />
          <p className="text-2xl text-t1 text-center">{`Ok creatoooooooor - you're all set`}</p>
          <div className="flex gap-4 items-center justify-center">
            <Link
              href={`/contest/${contestId}`}
              draggable={false}
              className="btn btn-ghost text-t2 normal-case"
            >
              Go to contest
            </Link>
            {isDroppable && <Link
              href={`/contest/${contestId}/create-drop?sid=${submissionId}`}
              draggable={false}
              className="btn btn-primary normal-case"
            >
              <div className="flex gap-2 items-center">
                <p>Create Drop</p>
                <HiSparkles className="w-5 h-5" />
              </div>
            </Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const RestrictionModal = ({
  isModalOpen,
  handleClose,
  userSubmitParams,
}: {
  isModalOpen: boolean;
  handleClose: () => void;
  userSubmitParams: UserSubmissionParams;
}) => {
  return (
    <Modal isModalOpen={isModalOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center bg-base rounded-xl p-2">
          <BiInfoCircle className="w-6 h-6 text-gray-500" />
          <p>
            Submitters must satisfy at least one restriction to create an entry.
          </p>
        </div>
        {userSubmitParams?.restrictionResults?.length ?? 0 > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>restrictions</th>
                  <th>Type</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userSubmitParams.restrictionResults.map((el, idx) => {
                  return (
                    <tr key={idx}>
                      <th>{idx + 1}</th>
                      <td>{el.restriction.tokenRestriction.token.type}</td>
                      <td>{el.restriction.tokenRestriction.threshold}</td>
                      {el.result === true ? (
                        <td>
                          <HiCheckBadge className="w-6 h-6 text-success" />
                        </td>
                      ) : (
                        <td>
                          <HiXCircle className="w-6 h-6 text-error" />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>no restrictions</p>
          </div>
        )}
      </div>
    </Modal>
  );
};


const StandardSubmit = ({
  params,
}: {
  params: { id: string };
}) => {
  const {
    submission,
    setSubmissionTitle,
    setSubmissionBody,
    setPreviewAsset,
    setVideoAsset,
    setErrors,
  } = useStandardSubmissionCreator();
  const { contestState } = useContestState();
  const { title, submissionBody, errors } = submission;
  const [isUploading, setIsUploading] = useState(false);

  if (!contestState) {
    return <LoadingDialog />;
  } else if (contestState !== "submitting") {
    return <p>not in submit window</p>;
  } else {
    // contest in submit window
    return (
      <div className="flex flex-col xl:flex-row-reverse w-11/12 lg:w-9/12 gap-4">
        <div className="max-w-none xl:max-w-[400px] w-full">
          <StudioSidebar
            state={submission}
            contestId={params.id}
            setErrors={setErrors}
            isUploading={isUploading}
          />
        </div>
        <div className="w-full">
          <Boundary size="small">
            <div className="w-11/12 xl:w-9/12 m-auto flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-t1">Create Submission</h1>
              <SubmissionTitle
                title={title}
                errors={errors}
                setSubmissionTitle={setSubmissionTitle}
              />
              <MediaUpload
                acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'video/mp4']}
                uploadStatusCallback={(status) => { setIsUploading(status) }}
                ipfsImageCallback={(url) => setPreviewAsset(url)}
                ipfsAnimationCallback={(url) => setVideoAsset(url)}
                maxVideoDuration={140}
              />
              <SubmissionBody
                submissionBody={submissionBody}
                errors={errors}
                setSubmissionBody={setSubmissionBody}
              />
            </div>
          </Boundary>
        </div>
      </div>
    );
  }
};

export default StandardSubmit;
