import "@/styles/editor.css";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import SimpleImage from "@editorjs/simple-image";
import { IpfsUpload } from "@/lib/mediaUpload";
import { createReactEditorJS } from "react-editor-js";

const EDITOR_JS_TOOLS = {
  list: List,
  image: {
    class: Image,
    config: {
      uploader: {
        async uploadByFile(file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          return IpfsUpload(file).then((ipfsUri) => {
            if (!ipfsUri) throw new Error("Error uploading file to ipfs");
            return {
              success: 1,
              file: {
                url: ipfsUri,
              },
            };
          });
        },
      },
    },
  },
};

const Editor = ({ data, onInitialize }) => {
  const ReactEditorJS = createReactEditorJS();

  return (
    <div
      className="flex flex-col justify-center bg-base-100 rounded-lg cursor-text 
                p-4 md:pr-5 md:pl-20 text-lg"
    >
      <ReactEditorJS
        tools={EDITOR_JS_TOOLS}
        defaultValue={data}
        onInitialize={onInitialize}
      />
    </div>
  );
};

export default Editor;
