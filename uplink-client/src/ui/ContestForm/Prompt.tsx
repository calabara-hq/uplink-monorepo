import { PromptUpload } from "@/ui/MediaUpload/PromptUpload";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import { BlockWrapper } from "./Entrypoint";
const Editor = dynamic(() => import("../Editor/Editor"), { ssr: false });

import {
  validatePrompt,
  ContestBuilderProps,
  PromptError,
} from "./contestHandler";
import { TbLoader2 } from "react-icons/tb";
const Prompt = ({
  initialPrompt,
  handleConfirm,
  errors,
  setErrors,
}: {
  initialPrompt: ContestBuilderProps["prompt"];
  handleConfirm: (prompt: ContestBuilderProps["prompt"]) => void;
  errors: PromptError;
  setErrors: (errors: PromptError) => void;
}) => {
  const [promptData, setPromptData] = useState(initialPrompt);
  const [isUploading, setIsUploading] = useState(false);
  const editorCallback = (data: OutputData) => {
    setPromptData((prevPromptData) => ({ ...prevPromptData, body: data }));
    setErrors({ ...errors, body: "" });
  };

  const onSubmit = () => {
    const { data, isError, errors } = validatePrompt(promptData);
    if (isError) return setErrors(errors);
    handleConfirm(data);
  };

  return (
    <BlockWrapper
      title="Contest Prompt"
      info="A call to action for your contest. What's it about?"
    >
      <div className="flex flex-col w-10/12">
        <div className="flex flex-col items-center w-full gap-6">
          <div className="flex flex-col gap-6 w-full items-center">
            <div className="flex flex-col-reverse lg:flex-row-reverse lg:items-end w-full xl:w-8/12 gap-6">
              <div className="flex flex-col w-full">
                <label className="text-sm p-1">Title</label>
                <input
                  className={`input ${errors.title ? "input-error" : "input"}`}
                  type="text"
                  value={promptData.title}
                  onChange={(e) => {
                    setPromptData((prevPromptData) => ({
                      ...prevPromptData,
                      title: e.target.value,
                    }));
                    setErrors({ ...errors, title: "" });
                  }}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title}
                    </span>
                  </label>
                )}
              </div>
              <PromptUpload
                acceptedFormats={['image/png', 'image/jpeg', 'image/jpg']}
                uploadStatusCallback={(status) => { setIsUploading(status)}}
                ipfsImageCallback={(url) => {
                  if(url){
                    setPromptData((prevPromptData) => ({
                      ...prevPromptData,
                      coverUrl: url,
                    }));
                    setErrors({ ...errors, coverUrl: "" });
                  }
                }}
                error={errors?.coverUrl ?? ""}
                initialData={promptData.coverUrl}
              />
            </div>
          </div>
          <div className="flex flex-col w-full xl:w-8/12">
            <label className="text-sm p-1">Body</label>
            {errors.body && (
              <label className="label pt-0">
                <span className="label-text-alt text-error ">
                  {errors.body}
                </span>
              </label>
            )}
            <Editor
              data={promptData.body ?? undefined}
              editorCallback={(data) => editorCallback(data)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2"></div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isUploading}
        className="btn btn-primary lowercase mt-4 self-end"
      >

        {isUploading ? (
        <div className="flex gap-2 items-center">
          <p className="text-sm">uploading</p>
          <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
        </div>
        ) : "confirm"
      }


      </button>
    </BlockWrapper>
  );
};

export default Prompt;
