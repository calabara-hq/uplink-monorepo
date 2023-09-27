import "@/styles/editor.css";
import { createReactEditorJS } from "react-editor-js";
import type { API, OutputData } from "@editorjs/editorjs";
import EDITOR_JS_TOOLS from "@/lib/editorTools";
import React from "react";

const Editor = ({
  data,
  editorCallback,
}: {
  data?: OutputData;
  editorCallback: (data: OutputData) => void;
}) => {
  const ReactEditorJS = createReactEditorJS();

  return (
    <div
      className="flex flex-col justify-center bg-base-100 rounded-lg cursor-text
                p-4 md:pr-5 md:pl-20 text-lg"
    >
      <ReactEditorJS
        tools={EDITOR_JS_TOOLS}
        defaultValue={data}
        onChange={(api: API) => {
          api.saver.save().then((outputData) => {
            return editorCallback(outputData);
          });
        }}
      />
    </div>
  );
};

export default Editor;
