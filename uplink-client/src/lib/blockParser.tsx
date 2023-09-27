import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import type { OutputData } from "@editorjs/editorjs";
import Image from "next/image";
import React from "react";
import parse from "html-react-parser";

function createTextLinks_(text: string) {
  return (text || "").replace(
    /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
    function (match, space, url) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return (
        space + '<a target="_blank" href="' + hyperlink + '">' + url + "</a>"
      );
    }
  );
}

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
  return content ? <p>{parse(content)}</p> : <></>;
};

const ImageRenderer = ({ data }: { data: any }) => {
  return (
    <div className="w-9/12 m-auto pt-4 pb-4">
      <ImageWrapper>
        <Image
          src={data.file.url}
          alt="content media"
          fill
          className="object-cover rounded-xl w-full h-full overflow-hidden"
          sizes="80vw"
        />
      </ImageWrapper>
    </div>
  );
};

const ListOutput = ({ data }) => {
  if (!data || !data.items || !Array.isArray(data.items)) return <></>;

  const content = data.items.map((item, index) => (
    <li key={index}>{parse(item)}</li>
  ));
  return <ul>{content}</ul>;
};

export const ParseBlocks = ({
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
