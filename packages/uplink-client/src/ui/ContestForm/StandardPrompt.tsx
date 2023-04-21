import handleMediaUpload from "@/lib/mediaUpload";
import MenuSelect from "../MenuSelect/MenuSelect";
import { useCallback, useRef, useState } from "react";
import { Option } from "../MenuSelect/MenuSelect";
import { ContestBuilderProps } from "@/app/contestbuilder/contestHandler";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
import { BlockWrapper } from "./ContestForm";
let Editor = dynamic(() => import("../Editor/Editor"), { ssr: false });

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
  const [mediaBlob, setMediaBlob] = useState<string | null>(null);
  const editorCallback = (data: OutputData) => {
    dispatch({
      type: "setPromptBody",
      payload: data,
    });
  };

  return (
    <BlockWrapper title="Contest Prompt">
      <div className="flex flex-col w-10/12">
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-row w-full">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-row w-full xl:w-8/12 gap-6">
                <div className="flex flex-col w-full">
                  <div className="flex flex-col w-1/3">
                    <label className="text-sm p-1">Label</label>
                    <MenuSelect
                      options={labelOptions}
                      selected={selectedLabel}
                      setSelected={setSelectedLabel}
                    />
                  </div>
                  <div className="flex flex-col mt-auto">
                    <label className="text-sm p-1">Title</label>
                    <input
                      className={`input ${
                        state.errors.prompt?.title
                          ? "input-error"
                          : "input-bordered"
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
                </div>
                <div className="flex flex-col ml-auto">
                  <label className="text-sm p-1">Cover Image</label>
                  <input
                    placeholder="Logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      handleMediaUpload(
                        event,
                        ["image"],
                        (base64) => {
                          setMediaBlob(base64);
                        },
                        (ipfsUrl) => {
                          dispatch({
                            type: "setCoverUrl",
                            payload: ipfsUrl,
                          });
                        }
                      );
                    }}
                    ref={imageUploader}
                  />
                  <div className="avatar">
                    <div
                      className="w-36 rounded-lg cursor-pointer flex justify-center items-center"
                      onClick={() => imageUploader.current?.click()}
                    >
                      {mediaBlob && <img src={mediaBlob} />}
                      {!mediaBlob && (
                        <div className="flex justify-center items-center w-full h-full rounded-lg bg-gray-500">
                          <p>cover image</p>
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
          </div>
          <div className="flex flex-col w-full xl:w-8/12">
            <label className="text-sm p-1">Body</label>
            {state.errors.prompt?.body && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {state.errors.prompt?.body}
                </span>
              </label>
            )}
            <Editor editorCallback={editorCallback} />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2"></div>
      </div>
    </BlockWrapper>
  );
};

export default StandardPrompt;
