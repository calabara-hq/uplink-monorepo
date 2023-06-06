import { OutputData } from "@editorjs/editorjs";
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

export const ParseBlocks = ({ data }: { data: OutputData }) => {
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
    } else if (block.type === "image") {
    } //TODO: add this
    return null;
  });
};
