"use client";
import Editor from "@/ui/Editor/Editor";
import { OutputData } from "@editorjs/editorjs";
import { HiPhoto, HiCamera, HiCheckBadge, HiXCircle } from "react-icons/hi2";
import { useEffect, useReducer, useRef, useState } from "react";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateSubmissionDocument } from "@/lib/graphql/submit.gql";

import {
  SubmissionBuilderProps,
  setField,
  setErrors,
  handleFileChange,
  reducer,
  validateSubmission,
} from "./studioHandler";
import VideoPreview from "@/ui/VideoPlayer/VideoPlayer";
import { VideoProvider } from "@/providers/VideoProvider";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSession } from "@/providers/SessionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import { BiInfoCircle } from "react-icons/bi";
import Modal from "@/ui/Modal/Modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { Decimal } from "decimal.js";
const initialState: SubmissionBuilderProps = {
  title: "",
  primaryAssetUrl: null,
  primaryAssetBlob: null,
  videoThumbnailUrl: null,
  videoThumbnailBlob: null,
  isVideo: false,
  isUploading: false,
  submissionBody: null,
  errors: {},
};

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
  dispatch,
}: {
  title: string;
  errors: SubmissionBuilderProps["errors"];
  dispatch: React.Dispatch<any>;
}) => {
  const handleTitleChange = (e: any) => {
    setField({ dispatch, field: "title", value: e.target.value });
  };

  const handleTextareaResize = (e: any) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div>
      <div className="flex items-center">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <p className="text-gray-500 text-sm text-right ml-auto">
          {100 - title.length} characters remaining
        </p>
      </div>

      <textarea
        rows={1}
        placeholder="What's happening?"
        className={`p-2 textarea textarea-lg resize-none w-full lg:w-[450px] overflow-y-hidden ${
          errors?.title ? "textarea-error" : "textarea textarea-lg"
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

const PrimaryAsset = ({
  isUploading,
  isVideo,
  primaryAssetUrl,
  primaryAssetBlob,
  videoThumbnailBlob,
  videoThumbnailUrl,
  errors,
  dispatch,
}: {
  isUploading: SubmissionBuilderProps["isUploading"];
  isVideo: SubmissionBuilderProps["isVideo"];
  primaryAssetUrl: SubmissionBuilderProps["primaryAssetUrl"];
  primaryAssetBlob: SubmissionBuilderProps["primaryAssetBlob"];
  videoThumbnailBlob: SubmissionBuilderProps["videoThumbnailBlob"];
  videoThumbnailUrl: SubmissionBuilderProps["videoThumbnailUrl"];
  errors: SubmissionBuilderProps["errors"];
  dispatch: React.Dispatch<any>;
}) => {
  const imageUploader = useRef<HTMLInputElement>(null);
  const thumbnailUploader = useRef<HTMLInputElement>(null);

  const Input = ({
    mode,
    children,
  }: {
    mode: "primary" | "thumbnail";
    children: React.ReactNode;
  }) => (
    <div>
      <label className="label">
        <span className="label-text">
          {mode === "primary" ? "Primary Asset" : "Thumbnail"}
        </span>
      </label>
      <input
        placeholder="asset"
        type="file"
        accept={mode === "primary" ? "image/*, video/mp4" : "image/*"}
        className="hidden"
        onChange={(event) =>
          handleFileChange({ event, dispatch, isVideo, mode })
        }
        ref={mode === "primary" ? imageUploader : thumbnailUploader}
      />
      {children}
    </div>
  );

  const PrimaryAssetPreview = () => {
    if (!isVideo) {
      return (
        <Input mode="primary">
          <div>
            <div
              className="w-28 h-28 lg:w-36 lg:h-36 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all rounded-xl"
              onClick={() => imageUploader.current?.click()}
            >
              {primaryAssetBlob && (
                <img src={primaryAssetBlob} className="rounded-xl" />
              )}
              {!primaryAssetBlob && (
                <div className="flex justify-center items-center w-full h-full">
                  <HiCamera className="w-8 h-8" />
                </div>
              )}
            </div>
            {isUploading && <p>optimizing ...</p>}
          </div>
        </Input>
      );
    } else if (isVideo && isUploading) {
      return (
        <div className="w-28 h-28 lg:w-36 lg:h-36 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all rounded-xl">
          optimizing ...
          <span className="loading loading-spinner text-primary"></span>
        </div>
      );
    } else if (isVideo && !isUploading && primaryAssetUrl) {
      return (
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col">
            <label className="label">
              <span className="label-text">Primary Asset</span>
            </label>
            <div className="w-28 h-28 lg:w-36 lg:h-36 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all rounded-xl">
              <VideoProvider>
                <VideoPreview url={primaryAssetUrl} id="primary-asset" />
              </VideoProvider>
            </div>
          </div>
          <Input mode="thumbnail">
            <div
              className="w-28 h-28 lg:w-36 lg:h-36 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all rounded-xl"
              onClick={() => thumbnailUploader.current?.click()}
            >
              {videoThumbnailBlob && (
                <img src={videoThumbnailBlob} className="rounded-xl" />
              )}
              {!videoThumbnailBlob && (
                <div className="flex justify-center items-center w-full h-full">
                  <HiPhoto className="w-8 h-8" />
                </div>
              )}
            </div>
          </Input>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <PrimaryAssetPreview />
      <ErrorLabel error={errors?.primaryAsset} />
    </div>
  );
};

const SubmissionBody = ({
  submissionBody,
  errors,
  dispatch,
}: {
  submissionBody: SubmissionBuilderProps["submissionBody"];
  errors: SubmissionBuilderProps["errors"];
  dispatch: React.Dispatch<any>;
}) => {
  const editorCallback = (data: OutputData) => {
    setField({ dispatch, field: "submissionBody", value: data });
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm p-1 mb-2">Body</label>
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
  dispatch,
  contestId,
  spaceName,
}: {
  state: SubmissionBuilderProps;
  dispatch: React.Dispatch<any>;
  contestId: string;
  spaceName: string;
}) => {
  const handleMutation = useHandleMutation(CreateSubmissionDocument);
  const { data: session, status } = useSession();
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
  const router = useRouter();

  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } =
    useContestInteractionState();
  const { stateRemainingTime } = useContestState();

  const handleSubmit = async () => {
    const { isError, errors, payload } = validateSubmission(state);
    if (isError) {
      // handle the special case of the type field since it doesn't belong to one single field
      if (errors?.type) return toast.error(errors.type);
      // handle the rest of the fields
      return setErrors({ dispatch, errors: errors });
    }

    await handleMutation({
      contestId,
      submission: payload,
    })
      .then((res) => {
        if (!res) return;
        if (res.error) return; // known error handled by the mutation hook (didn't throw)
        const { errors: mutationErrors, success } = res.data?.createSubmission;
        if (!success) {
          console.log(mutationErrors);
          return toast.error(
            "Oops, something went wrong. Please check the fields and try again."
          );
        } else if (success) {
          toast.success("Submission created successfully", {
            icon: "🎉",
          });
          router.refresh();
          router.push(`${spaceName}/contests/${contestId}`);
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error("unknown error");
      });
  };
  // userSubmitParams are undefined if the user is not logged in, if the contest is not in the submit window, or if the fetch hasn't finished yet
  // at this stage, we can assume that the contest is in the submit window.
  if (isLoading) {
    // waiting for results. show loading state
    return (
      <div className="hidden lg:flex lg:flex-col items-center lg:w-2/6 gap-4">
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
      </div>
    );
  } else {
    return (
      <div className="hidden lg:flex lg:flex-col items-center lg:w-2/6 gap-4">
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
          <div className="flex flex-col bg-base-100 rounded-lg gap-4 w-full p-2">
            <h2 className="text-lg font-bold">Eligibility</h2>
            {userSubmitParams && (
              <div className="flex flex-col gap-2 items-start justify-center w-full p-2">
                <div className="flex flex-row gap-2 w-full">
                  <p>entries remaining</p>
                  <p className="ml-auto">
                    {userSubmitParams.remainingSubPower}
                  </p>
                </div>
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
                <div className="flex flex-row gap-2 w-full">
                  <p>status</p>
                  {userSubmitParams.restrictionResults.some(
                    (el) => el.result === true
                  ) &&
                  new Decimal(userSubmitParams.maxSubPower).greaterThan(0) ? (
                    <p className="ml-auto">eligible</p>
                  ) : (
                    <p className="ml-auto"> not eligible</p>
                  )}
                </div>
              </div>
            )}
            <WalletConnectButton>
              <div className="flex flex-row items-center justify-between bg-base-200 rounded-lg gap-2 h-fit w-full">
                <button
                  onClick={handleSubmit}
                  className="btn btn-accent flex flex-1"
                >
                  Submit
                </button>
                <p className="mx-2 p-2 text-center">{stateRemainingTime}</p>
              </div>
            </WalletConnectButton>
          </div>
        </div>
        <Modal
          isModalOpen={isRestrictionModalOpen}
          onClose={() => {
            setIsRestrictionModalOpen(false);
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center bg-base rounded-xl p-2">
              <BiInfoCircle className="w-6 h-6 text-gray-500" />
              <p>
                Submitters must satisfy at least one restriction to create an
                entry.
              </p>
            </div>
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
                  <tr>
                    <th>1</th>
                    <td>ETH</td>
                    <td>0.0001</td>
                    <td className="">
                      <HiCheckBadge className="w-6 h-6 text-success" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};

const StudioSkeleton = () => {
  return (
    <>
      <div className="flex flex-col w-full lg:w-3/4 h-screen gap-4 m-8">
        <div className="flex flex-col lg:flex-row justify-between items-end">
          <div className="bg-base-100 w-full lg:w-[450px] h-12 shimmer rounded-xl" />
          <div className="w-28 h-28 lg:w-36 lg:h-36 cursor-pointer flex justify-center items-center bg-base-100 shimmer rounded-xl" />
        </div>
        <div className="flex flex-col w-full h-64 bg-base-100 shimmer" />
      </div>
      <div className="hidden lg:flex lg:flex-col items-center lg:w-2/6 gap-4">
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
      </div>
    </>
  );
};

const StandardSubmit = ({
  params,
}: {
  params: { name: string; id: string };
}) => {
  const { contestState, stateRemainingTime, type, category } =
    useContestState();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    title,
    primaryAssetBlob,
    primaryAssetUrl,
    isVideo,
    videoThumbnailBlob,
    videoThumbnailUrl,
    submissionBody,
    isUploading,
    errors,
  } = state;

  if (!contestState) {
    return <StudioSkeleton />;
  } else if (contestState !== "submitting") {
    return <p>not in submit window</p>;
  } else {
    // contest in submit window
    return (
      <>
        <div className="flex flex-col w-full lg:w-3/4 gap-4">
          <div className="flex flex-col lg:flex-row w-full justify-between items-end gap-2">
            <SubmissionTitle
              title={title}
              errors={errors}
              dispatch={dispatch}
            />
            <PrimaryAsset
              isUploading={isUploading}
              primaryAssetUrl={primaryAssetUrl}
              primaryAssetBlob={primaryAssetBlob}
              videoThumbnailUrl={videoThumbnailUrl}
              videoThumbnailBlob={videoThumbnailBlob}
              isVideo={isVideo}
              errors={errors}
              dispatch={dispatch}
            />
          </div>
          <SubmissionBody
            submissionBody={submissionBody}
            errors={errors}
            dispatch={dispatch}
          />
        </div>
        <StudioSidebar
          state={state}
          dispatch={dispatch}
          contestId={params.id}
          spaceName={params.name}
        />
      </>
    );
  }
};

export default StandardSubmit;
