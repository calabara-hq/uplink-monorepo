"use client";;
import { replaceIpfsLinkWithGateway } from "@/lib/ipfs";
import Image from "next/image"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from "react";

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
    return (
        <u className="text-primary12">{props.children}</u>
    )
}

// takes in the output of serialized markdown
export const RenderMarkdown = ({ content }: { content: string }) => {

    const [mdxSource, setMdxSource] = useState<any>(null)

    const components = {
        a: LinkRenderer,
        img: ImageRenderer,
        u: UnderlineRenderer,
    };


    const process = async () => {
        const source = await serialize(replaceIpfsLinkWithGateway(content), {
            // Optionally pass remark/rehype plugins
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkBreaks],
                rehypePlugins: [],
            },
        });

        return source
    }

    useEffect(() => {
        process().then((source) => {
            setMdxSource(source)
        })
    }, [])


    if (!mdxSource) return (
        <div className="flex flex-col gap-2 w-full">
            <div className="shimmer h-4 w-64 bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
        </div>
    )


    return (
        <div className="mt-2 text-t2 prose prose-neutral prose-invert">
            <MDXRemote {...mdxSource} components={components} />
        </div>
    )
}