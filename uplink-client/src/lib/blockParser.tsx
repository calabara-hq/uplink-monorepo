"use client";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import type { OutputData } from "@editorjs/editorjs";
import React, { useEffect } from "react";
import Output, { LinkToolOutput, ListOutput, ParagraphOutput } from 'editorjs-react-renderer';
import UplinkImage from "@/lib/UplinkImage"
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

const ImageRenderer = ({ data }: { data: any }) => {
  return (
    <div className="m-auto pt-4 pb-4">
      <ImageWrapper>
        <UplinkImage
          src={data.file.url}
          alt="content media"
          fill
          className="object-contain rounded-xl w-full h-full overflow-hidden"
          sizes="40vw"
        />
      </ImageWrapper>
    </div>
  );
};

const ParagraphRenderer = ({ data }) => {
  return <ParagraphOutput data={data} />;
}

const ListRenderer = ({ data }) => {
  return <ListOutput data={data} />;
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
    list: ListRenderer,
  };

  if (!data || !data.blocks || !Array.isArray(data.blocks)) return null;


  return (
    <section className="hyperlinks">
      <Output data={data} renderers={renderers} />
    </section>
  )

};

export default ParseBlocks;
