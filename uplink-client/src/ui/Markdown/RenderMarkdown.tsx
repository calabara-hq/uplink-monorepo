import Markdown from "react-markdown"

export const LinkRenderer = (props: any) => {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className="no-underline text-primary12 hover:underline">
            {props.children}
        </a>
    )
}

export const RenderMarkdown = ({ content }: { content: string }) => {
    return <Markdown components={{ a: LinkRenderer }}>{content}</Markdown>
}