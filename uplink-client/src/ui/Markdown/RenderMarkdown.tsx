import { replaceIpfsLinkWithGateway } from "@/lib/ipfs";
import Image from "next/image"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { MDXRemote } from 'next-mdx-remote/rsc';
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

// takes in the output of serialized markdown
export const RenderMarkdown = ({ content }: { content: string }) => {

    //const data = replaceIpfsLinkWithGateway(content).replace(/\n\n/g, '\n')

    const data = replaceIpfsLinkWithGateway(content)
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