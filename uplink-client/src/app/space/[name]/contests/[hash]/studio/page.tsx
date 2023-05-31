"use client";
import handleMediaUpload from "@/lib/mediaUpload";
import Editor from "@/ui/Editor/Editor";
import { OutputData } from "@editorjs/editorjs";
import { UserIcon } from "@heroicons/react/24/solid";
import { useReducer, useRef } from "react";

const initialState = {
  title: "",
  primaryAsset: null,
  primaryAssetBlob: null,
  videoThumbnailUrl: null,
  videoThumbnailBlob: null,
  isVideo: false,
  submissionBody: null,
  errors: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    default:
      return state;
  }
};

const ErrorLabel = ({ error }) =>
  error && (
    <label className="label">
      <span className="label-text-alt text-error">{error}</span>
    </label>
  );

const SubmissionTitle = ({ title, errors, dispatch }) => {
  const handleTitleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      payload: { field: "title", value: e.target.value },
    });
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

const PrimaryAsset = ({ isVideo, primaryAssetBlob, dispatch, errors }) => {
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
        onChange={(event) => {
          handleMediaUpload(
            event,
            ["image", "video"],
            (mimeType) => {
              // check if video
              if (mimeType.includes("video")) {
                dispatch({
                  type: "setIsVideo",
                  payload: true,
                });
              }
            },
            (base64) => {
              if (!isVideo) {
                dispatch({
                  type: "SET_FIELD",
                  payload: { field: "primaryAssetBlob", value: base64 },
                });
              }
            },
            (ipfsUrl) => {
              dispatch({
                type: "SET_FIELD",
                payload: { field: "primaryAssetUrl", value: ipfsUrl },
              });
            }
          );
        }}
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
          </div>
        )}
        {isVideo && (
          <div className="w-28 h-28 cursor-pointer flex justify-center items-center bg-base-100 hover:bg-base-200 transition-all">
            processing ...
          </div>
        )}
      </div>
      <ErrorLabel error={errors?.primaryAsset} />
    </div>
  );
};

const SubmissionBody = ({ submissionBody, errors, dispatch }) => {
  const editorCallback = (data) => {
    dispatch({
      type: "SET_FIELD",
      payload: { field: "submissionBody", value: data },
    });
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm p-1">Body</label>
      <ErrorLabel error={errors.submissionBody} />
      <Editor
        data={submissionBody ?? undefined}
        editorCallback={editorCallback}
      />
    </div>
  );
};

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { title, primaryAssetBlob, isVideo, submissionBody, errors } = state;

  return (
    <div>
      <div>
        <SubmissionTitle title={title} errors={errors} dispatch={dispatch} />
        <PrimaryAsset
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
