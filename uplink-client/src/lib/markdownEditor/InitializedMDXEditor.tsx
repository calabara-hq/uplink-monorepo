'use client'
import type { ForwardedRef } from 'react'
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    toolbarPlugin,
    linkPlugin,
    linkDialogPlugin,
    BoldItalicUnderlineToggles,
    type MDXEditorMethods,
    type MDXEditorProps,
    CreateLink
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'


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
                            {' '}
                            <BoldItalicUnderlineToggles />
                            <CreateLink />
                        </>
                    )
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