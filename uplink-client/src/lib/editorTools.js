import "@/styles/editor.css";

import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import { IpfsUpload } from "@/lib/mediaUpload";

const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: ['bold', 'italic', 'link'],
    },
    list: {
        class: List,
        inlineToolbar: ['bold', 'italic', 'link'],
    },

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

export default EDITOR_JS_TOOLS;