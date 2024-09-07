'use client'
import type { ForwardedRef } from 'react'
import {
    headingsPlugin,
    listsPlugin,
    ListsToggle,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    toolbarPlugin,
    linkPlugin,
    linkDialogPlugin,
    InsertImage,
    imagePlugin,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    type MDXEditorMethods,
    type MDXEditorProps,
    CreateLink
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { IpfsUpload } from '@/hooks/useMediaUpload'
import toast from 'react-hot-toast'


const supportedImageFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp']


// Only import this to the next file
export default function InitializedMDXEditor({
    // triggerSave,
    editorRef,
    ...props
}: { //triggerSave: () => string,
    editorRef: ForwardedRef<MDXEditorMethods> | null
} & MDXEditorProps) {



    return (
        <MDXEditor
            className="dark-theme dark-editor"

            plugins={[
                // Example Plugin Usage
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <BoldItalicUnderlineToggles />
                            <InsertImage />
                            <CreateLink />
                            <BlockTypeSelect />
                            <ListsToggle options={['bullet', 'number']} />
                        </>
                    )
                }),
                imagePlugin({
                    imageUploadHandler: (image: File) => {
                        try {
                            if (!supportedImageFormats.includes(image.type)) throw new Error("Invalid image format")
                            return IpfsUpload(image)
                        } catch (error) {
                            console.log(error)
                            if (error.message.includes("Invalid image format")) {
                                toast.error("Invalid image format")
                            }
                            else toast.error("Error uploading image")

                            return Promise.reject(error)
                        }
                    },
                }),
                linkDialogPlugin(),
                linkPlugin(),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin()
            ]}
            {...props}
            ref={editorRef}
        />
    )
}