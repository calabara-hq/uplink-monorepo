"use client";
import { OutputData } from "@editorjs/editorjs";
import { UserIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateSubmissionDocument } from "@/lib/graphql/submit.gql";
import { SubmissionBuilderProps } from "@/providers/ContestState";
import dynamic from "next/dynamic";
import { handleFileChange, handleSubmit } from "./studioHandler";
import VideoPreview from "@/ui/VideoPlayer/VideoPlayer";
import { VideoProvider } from "@/providers/VideoProvider";
import { useContestInteractionContext } from "@/providers/ContestState";
import ContestSidebar from "@/ui/Contests/ContestSidebar";

const Editor = dynamic(() => import("@/ui/Editor/Editor"), { ssr: false });

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
  setSubmissionField,
}: {
  title: string;
  errors: SubmissionBuilderProps["errors"];
  setSubmissionField: React.Dispatch<any>;
}) => {
  const handleTitleChange = (e: any) => {
    setSubmissionField({ field: "title", value: e.target.value });
  };

  return (
    <div>
      <label className="label">
        <span className="label-text">Title</span>
      </label>
      <input
        type="text"
        autoComplete="off"
        spellCheck="false"
        value={title}
        onChange={handleTitleChange}
        placeholder="Nouns"
        className={`input w-full max-w-xs ${
          errors?.title ? "input-error" : "input-bordered"
        }`}
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
  setSubmissionField,
}: {
  isUploading: SubmissionBuilderProps["isUploading"];
  isVideo: SubmissionBuilderProps["isVideo"];
  primaryAssetUrl: SubmissionBuilderProps["primaryAssetUrl"];
  primaryAssetBlob: SubmissionBuilderProps["primaryAssetBlob"];
  videoThumbnailBlob: SubmissionBuilderProps["videoThumbnailBlob"];
  videoThumbnailUrl: SubmissionBuilderProps["videoThumbnailUrl"];
  errors: SubmissionBuilderProps["errors"];
  setSubmissionField: React.Dispatch<any>;
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
          {mode === "primary" ? "Primary Asset" : "thumbnail"}
        </span>
      </label>
      <input
        placeholder="asset"
        type="file"
        accept={mode === "primary" ? "image/*, video/mp4" : "image/*"}
        className="hidden"
        onChange={(event) =>
          handleFileChange({ event, setSubmissionField, isVideo, mode })
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
              className="w-28 h-28 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all"
              onClick={() => imageUploader.current?.click()}
            >
              {primaryAssetBlob && <img src={primaryAssetBlob} />}
              {!primaryAssetBlob && (
                <div className="flex justify-center items-center w-full h-full">
                  <UserIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            {isUploading && <p>optimizing ...</p>}
          </div>
        </Input>
      );
    } else if (isVideo && isUploading) {
      return (
        <div className="w-28 h-28 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all">
          optimizing ...
        </div>
      );
    } else if (isVideo && !isUploading && primaryAssetUrl) {
      return (
        <div className="flex flex-row gap-4">
          <div className="flex flex-col">
            <label className="label">
              <span className="label-text">Primary Asset</span>
            </label>
            <div className="w-28 h-28 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all">
              <VideoProvider>
                <VideoPreview url={primaryAssetUrl} id="primary-asset" />
              </VideoProvider>
            </div>
          </div>
          <Input mode="thumbnail">
            <div
              className="w-28 h-28 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all"
              onClick={() => thumbnailUploader.current?.click()}
            >
              {videoThumbnailBlob && <img src={videoThumbnailBlob} />}
              {!videoThumbnailBlob && (
                <div className="flex justify-center items-center w-full h-full">
                  <UserIcon className="w-8 h-8" />
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
  setSubmissionField,
}: {
  submissionBody: SubmissionBuilderProps["submissionBody"];
  errors: SubmissionBuilderProps["errors"];
  setSubmissionField: React.Dispatch<any>;
}) => {
  const editorCallback = (data: OutputData) => {
    setSubmissionField({ field: "submissionBody", value: data });
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm p-1">Body</label>
      <ErrorLabel error={errors?.submissionBody} />

      <Editor
        data={submissionBody ?? undefined}
        editorCallback={editorCallback}
      />
    </div>
  );
};

const StudioSubmitButton = ({ contestId }: { contestId: number }) => {
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

export default function Page({ params }: { params: { id: string } }) {
  const {
    userSubmission,
    setSubmissionField,
    setSubmissionErrors,
    resetSubmission,
  } = useContestInteractionContext();

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
  } = userSubmission;

  const handleMutation = useHandleMutation(CreateSubmissionDocument);

  return (
    <>
      <div className="flex flex-col w-full lg:w-3/4 gap-4">
        <div>
          <SubmissionTitle
            title={title}
            errors={errors}
            setSubmissionField={setSubmissionField}
          />
          <PrimaryAsset
            isUploading={isUploading}
            primaryAssetUrl={primaryAssetUrl}
            primaryAssetBlob={primaryAssetBlob}
            videoThumbnailUrl={videoThumbnailUrl}
            videoThumbnailBlob={videoThumbnailBlob}
            isVideo={isVideo}
            errors={errors}
            setSubmissionField={setSubmissionField}
          />
          <SubmissionBody
            submissionBody={submissionBody}
            errors={errors}
            setSubmissionField={setSubmissionField}
          />
        </div>
      </div>
    </>
  );
}
