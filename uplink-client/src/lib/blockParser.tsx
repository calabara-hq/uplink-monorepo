import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import { OutputData } from "@editorjs/editorjs";
import Image from "next/image";
import React from "react";

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

export const ParseBlocks = ({
  data,
  omitImages = false,
}: {
  data: OutputData;
  omitImages?: boolean;
}) => {
  if (!data || data.blocks.length === 0) return null;
  return data.blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return <p key={index}>{block.data.text}</p>;
    } else if (block.type === "header") {
      return React.createElement(
        `h${block.data.level}`,
        { key: index },
        block.data.text
      );
    } else if (block.type === "image" && !omitImages) {
      return (
        <div className="w-9/12 m-auto pt-4 pb-4" key={index}>
          <ImageWrapper>
            <Image
              key={index}
              src={block.data.file.url}
              alt="content media"
              fill
              className="object-cover rounded-xl w-full h-full overflow-hidden"
              sizes="80vw"
            />
          </ImageWrapper>
        </div>
      );
    }
    return null;
  });
};

