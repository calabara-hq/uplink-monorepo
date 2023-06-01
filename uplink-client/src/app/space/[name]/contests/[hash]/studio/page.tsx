"use client";
import Editor from "@/ui/Editor/Editor";
import { OutputData } from "@editorjs/editorjs";
import { UserIcon } from "@heroicons/react/24/solid";
import { useEffect, useReducer, useRef } from "react";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateSubmissionDocument } from "@/lib/graphql/submit.gql";

import {
  SubmissionBuilderProps,
  setField,
  setErrors,
  handleFileChange,
  handleSubmit,
} from "./studioHandler";

const initialState: SubmissionBuilderProps = {
  title: "",
  primaryAsset: null,
  primaryAssetBlob: null,
  videoThumbnailUrl: null,
  videoThumbnailBlob: null,
  isVideo: false,
  isUploading: false,
  submissionBody: null,
  errors: {},
};

const reducer = (state: SubmissionBuilderProps, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
        errors: {
          ...state.errors,
          [action.payload.field]: undefined,
        },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
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
  primaryAssetBlob,
  errors,
  dispatch,
}: {
  isUploading: SubmissionBuilderProps["isUploading"];
  isVideo: SubmissionBuilderProps["isVideo"];
  primaryAssetBlob: SubmissionBuilderProps["primaryAssetBlob"];
  errors: SubmissionBuilderProps["errors"];
  dispatch: React.Dispatch<any>;
}) => {
  const imageUploader = useRef(null);

  return (
    <div>
      <label className="label">
        <span className="label-text">Primary Asset</span>
      </label>
      <input
        placeholder="asset"
        type="file"
        accept="image/*, video/mp4"
        className="hidden"
        onChange={(event) => handleFileChange({ event, dispatch, isVideo })}
        ref={imageUploader}
      />
      <div>
        {!isVideo && (
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
            {isUploading && <p>optimizing ...</p>}
          </div>
        )}
        {isVideo && isUploading && (
          <div className="w-28 h-28 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all">
            optimizing ...
          </div>
        )}
      </div>
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
    isVideo,
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
          primaryAssetBlob={primaryAssetBlob}
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
