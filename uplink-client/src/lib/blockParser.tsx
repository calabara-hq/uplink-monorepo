import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import type { OutputData } from "@editorjs/editorjs";
import Image from "next/image";
import React from "react";
import sanitizeHtml from "sanitize-html";

const createLinks = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const twitterRegex = /([^\S]|^)@(\w+)/gi;
  return text
    .replace(urlRegex, (url) => {
      const dispUrl = url.replace(/(^\w+:|^)\/\//, ""); // drop protocol from url
      return `<a target="_blank" href="${url}">${dispUrl}</a>`;
    })
    .replace(twitterRegex, (handle) => {
      const linkUrl = `https://twitter.com/${handle.replace(" ", "")}`;
      return `<a target="_blank" href="${linkUrl}">${handle}</a>`;
    });
};

const ParagraphRenderer = ({ data }) => {
  if (!data) return <></>;
  let content = null;
  if (typeof data === "string") content = data;
  else if (
    typeof data === "object" &&
    data.text &&
    typeof data.text === "string"
  )
    content = data.text;
  return content ? (
    <p
      className="text-t1 hyperlinks"
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(createLinks(content)),
      }}
    ></p>
  ) : (
    <></>
  );
};

const ImageRenderer = ({ data }: { data: any }) => {
  return (
    <div className="w-9/12 m-auto pt-4 pb-4">
      <ImageWrapper>
        <Image
          src={data.file.url}
          alt="content media"
          fill
          className="object-contain rounded-xl w-full h-full overflow-hidden"
          sizes="80vw"
        />
      </ImageWrapper>
    </div>
  );
};

const ListOutput = ({ data }) => {
  if (!data || !data.items || !Array.isArray(data.items)) return <></>;

  const content = data.items.map((item, idx) => {
    return (
      <li
        key={idx}
        className="text-t1 hyperlinks"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(createLinks(item)) }}
      />
    );
  });

  return <ul className="list-disc list-inside pl-2">{content}</ul>;


};

const ParseBlocks = ({
  data,
  omitImages = false,
}: {
  data: OutputData;
  omitImages?: boolean;
}) => {
  const renderers = {
    image: omitImages ? null : ImageRenderer,
    paragraph: ParagraphRenderer,
    list: ListOutput,
  };

  if (!data || !data.blocks || !Array.isArray(data.blocks)) return null;

  return (
    <>
      {data.blocks.map((block, idx) => {
        const key = block.type.toLowerCase();
        let Renderer = renderers[key];
        if (!Renderer) return <></>;
        return <Renderer key={idx} data={block.data} />;
      })}
    </>
  );
};

export default ParseBlocks;
