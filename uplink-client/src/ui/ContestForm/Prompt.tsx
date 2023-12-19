import handleMediaUpload from "@/lib/mediaUpload";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import { BlockWrapper } from "./Entrypoint";
const Editor = dynamic(() => import("../Editor/Editor"), { ssr: false });
import { HiPhoto } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import {
  validatePrompt,
  ContestBuilderProps,
  PromptError,
} from "./contestHandler";
import UplinkImage from "@/lib/UplinkImage"
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
  const imageUploader = useRef<HTMLInputElement>(null);
  const [promptData, setPromptData] = useState(initialPrompt);

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
              <div className="flex flex-col ml-auto">
                <label className="text-sm p-1">Cover Image</label>
                <input
                  placeholder="Logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    handleMediaUpload(
                      event,
                      ["image"],
                      (mimeType) => {},
                      (base64) => {
                        setPromptData((prevPromptData) => ({
                          ...prevPromptData,
                          coverBlob: base64,
                        }));
                      },
                      (ipfsUrl) => {
                        setPromptData((prevPromptData) => ({
                          ...prevPromptData,
                          coverUrl: ipfsUrl,
                        }));
                        setErrors({ ...errors, coverUrl: "" });
                      }
                    ).catch((err) => {
                      console.log(err);
                      setErrors({ ...errors, coverUrl: "" });
                      return toast.error("couldn't upload your image");
                    });
                  }}
                  ref={imageUploader}
                />
                <div className="avatar">
                  <div
                    className="w-36 rounded-lg cursor-pointer flex justify-center items-center"
                    onClick={() => imageUploader.current?.click()}
                  >
                    {promptData.coverBlob && (
                      <UplinkImage
                        src={promptData.coverBlob}
                        alt="prompt cover image"
                        height={32}
                        width={32}
                      />
                    )}
                    {!promptData.coverBlob && (
                      <div className="flex justify-center items-center w-full h-full rounded-lg bg-base-100 hover:bg-base-200 transition-all">
                        <HiPhoto className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
                {errors?.coverUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors?.coverUrl}
                    </span>
                  </label>
                )}
              </div>
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
        className="btn btn-primary lowercase mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

export default Prompt;
