import { parseIpfsUrl, replaceIpfsLinkWithGateway } from "@/lib/ipfs"
import Image from "next/image"
import Markdown from "react-markdown"

export const LinkRenderer = (props: any) => {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className="no-underline text-primary12 hover:underline">
            {props.children}
        </a>
    )
}

export const ImageRenderer = (props: any) => {
    console.log(props)
    return (
        <Image src={props.src} alt={props.alt} className="rounded-lg m-auto" width={500} height={500} />
    )
}

export const RenderMarkdown = ({ content }: { content: string }) => {
    return (
        <Markdown

            components={{
                a: LinkRenderer,
                img: ImageRenderer
            }}>
            {replaceIpfsLinkWithGateway(content)}
        </Markdown>
    )
}