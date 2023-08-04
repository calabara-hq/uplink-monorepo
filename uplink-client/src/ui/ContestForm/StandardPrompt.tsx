import handleMediaUpload from "@/lib/mediaUpload";
import MenuSelect from "../MenuSelect/MenuSelect";
import { useCallback, useRef, useState } from "react";
import { Option } from "../MenuSelect/MenuSelect";
import { ContestBuilderProps } from "@/lib/contestHandler";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
import { BlockWrapper } from "./ContestForm";
let Editor = dynamic(() => import("../Editor/Editor"), { ssr: false });
import { HiPhoto } from "react-icons/hi2";
import { toast } from "react-hot-toast";

const labelOptions: Option[] = [
  { value: "art", label: "art" },
  { value: "design", label: "design" },
  { value: "misc", label: "misc" },
];

const StandardPrompt = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [selectedLabel, setSelectedLabel] = useState<Option>(labelOptions[0]);
  const imageUploader = useRef<HTMLInputElement>(null);
  const editorCallback = (data: OutputData) => {
    dispatch({
      type: "setPromptBody",
      payload: data,
    });
  };

  return (
    <BlockWrapper
      title="Contest Prompt"
      info="Choose a cover image, title, and body"
    >
      <div className="flex flex-col w-10/12">
        <div className="flex flex-col items-center w-full gap-6">
          <div className="flex flex-col gap-6 w-full items-center">
            <div className="flex flex-col-reverse lg:flex-row-reverse lg:items-end w-full xl:w-8/12 gap-6">
              <div className="flex flex-col w-full">
                <label className="text-sm p-1">Title</label>
                <input

                  className={`input ${
                    state.errors.prompt?.title
                      ? "input-error"
                      : "input"
                  }`}
                  type="text"
                  value={state.prompt.title}
                  onChange={(e) =>
                    dispatch({
                      type: "setPromptTitle",
                      payload: e.target.value,
                    })
                  }
                />
                {state.errors.prompt?.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {state.errors.prompt?.title}
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
                      (mimeType) => {
                        console.log(mimeType);
                      },
                      (base64) => {
                        dispatch({
                          type: "setCoverBlob",
                          payload: base64,
                        });
                      },
                      (ipfsUrl) => {
                        dispatch({
                          type: "setCoverUrl",
                          payload: ipfsUrl,
                        });
                      }
                    ).catch((err) => {
                      
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
                    {state.prompt.coverBlob && (
                      <img src={state.prompt.coverBlob} />
                    )}
                    {!state.prompt.coverBlob && (
                      <div className="flex justify-center items-center w-full h-full rounded-lg bg-base-100 hover:bg-base-200 transition-all">
                        <HiPhoto className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
                {state.errors?.prompt?.coverUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {state.errors?.prompt?.coverUrl}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full xl:w-8/12">
            <label className="text-sm p-1">Body</label>
            {state.errors.prompt?.body && (
              <label className="label pt-0">
                <span className="label-text-alt text-error ">
                  {state.errors.prompt?.body}
                </span>
              </label>
            )}
            <Editor
              data={state.prompt.body ?? undefined}
              editorCallback={editorCallback}
            />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2"></div>
      </div>
    </BlockWrapper>
  );
};

export default StandardPrompt;
