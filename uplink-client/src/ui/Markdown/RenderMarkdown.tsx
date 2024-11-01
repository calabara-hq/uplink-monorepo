
"use client";

import { parseIpfsUrl, replaceIpfsLinkWithGateway } from "@/lib/ipfs"
import Image from "next/image"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'
import remarkSmartpants from 'remark-smartypants'
import rehypePrettyCode from 'rehype-pretty-code'

export const LinkRenderer = (props: any) => {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className="no-underline text-primary12 hover:underline">
            {props.children}
        </a>
    )
}

export const ImageRenderer = (props: any) => {
    return (
        <Image src={props.src} alt={props.alt} className="rounded-lg m-auto" width={500} height={500} />
    )
}

export const UnderlineRenderer = (props: any) => {
    console.log('got here')
    return (
        <u className="text-primary12">{props.children}</u>
    )
}


function convertMarkdownToMDX(markdown) {
    // This is a very basic and naive conversion example.
    // For more complex content, you should use a proper Markdown-to-MDX converter.
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '**$1**') // Bold text
        .replace(/\*(.*?)\*/g, '*$1*')       // Italic text
        .replace(/__(.*?)__/g, '__$1__')     // Underlined text
        .replace(/\n/g, '\n\n');             // Preserve newlines for paragraphs
}

// takes in the output of serialized markdown
export const RenderMarkdown = ({ content }: { content: string }) => {

    //const data = replaceIpfsLinkWithGateway(content).replace(/\n\n/g, '\n')

    const data = convertMarkdownToMDX(replaceIpfsLinkWithGateway(content))

    const components = {
        a: LinkRenderer,
        img: ImageRenderer,
        u: UnderlineRenderer,
    };

    return (
        <MDXRemote
            source={data}
            components={components}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkSmartpants, remarkGfm, remarkBreaks],
                    rehypePlugins: [
                        [
                            rehypePrettyCode,
                        ],
                    ],
                },
            }}
        />
    )

    // return (
    //     <Markdown
    //         remarkPlugins={[remarkGfm, remarkBreaks]}
    //         components={{
    //             a: LinkRenderer,
    //             img: ImageRenderer,
    //             u: UnderlineRenderer
    //         }}>
    //         {content}
    //     </Markdown>
    // )
}