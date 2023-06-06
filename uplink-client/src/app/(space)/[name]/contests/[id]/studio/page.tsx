"use client";
import Editor from "@/ui/Editor/Editor";
import { OutputData } from "@editorjs/editorjs";
import { UserIcon } from "@heroicons/react/24/solid";
import { useEffect, useReducer, useRef, useState } from "react";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateSubmissionDocument } from "@/lib/graphql/submit.gql";

import {
  SubmissionBuilderProps,
  setField,
  setErrors,
  handleFileChange,
  handleSubmit,
  reducer,
} from "./studioHandler";
import VideoPreview from "@/ui/VideoPlayer/VideoPlayer";
import { VideoProvider } from "@/providers/VideoProvider";
import Image from "next/image";

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
          {mode === "primary" ? "Primary Asset" : "thumbnail"}
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
      <label className="text-sm p-1">Body</label>
      <ErrorLabel error={errors?.submissionBody} />
      <Editor
        data={submissionBody ?? undefined}
        editorCallback={editorCallback}
      />
    </div>
  );
};

export default function Page({ params }: { params: { hash: number } }) {
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

  const handleMutation = useHandleMutation(CreateSubmissionDocument);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() =>
          handleSubmit({
            state,
            dispatch,
            handleMutation,
            contestId: params.hash,
          })
        }
      >
        Publish
      </button>
      <div>
        <SubmissionTitle title={title} errors={errors} dispatch={dispatch} />
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
        <SubmissionBody
          submissionBody={submissionBody}
          errors={errors}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
