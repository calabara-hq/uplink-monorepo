// Render the submission in a card format. This is used in the contest page + the homepage.
"use client";
import type { Submission } from "@/types/submission";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { isMobile } from "@/lib/isMobile";
import dynamic from "next/dynamic";
import { UsernameDisplay, UserAvatar } from "../AddressDisplay/AddressDisplay";
import { ImageWrapper } from "./MediaWrapper";
import { TbCrown } from "react-icons/tb";
import { ParseThread } from "@/lib/threadParser";
import { RenderInteractiveVideoWithLoader } from "@/ui/VideoPlayer";
import { Decimal } from "decimal.js";
import formatDecimal from "@/lib/formatDecimal";

const SubmissionModal = dynamic(() => import("./SubmissionModal"), {
  ssr: false,
});
const ParseBlocks = dynamic(() => import("@/lib/blockParser"), {
  ssr: true,
});

const SubmissionBody = ({ submission }: { submission: Submission }) => {
  const totalVotes = new Decimal(submission.totalVotes ?? "0");

  if (submission.data.type !== "text")
    return (
      <div className="relative flex flex-col gap-2 rounded-b-lg w-full p-2 ">
        <h2 className="text-lg font-semibold">{submission.data.title}</h2>
        <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
          <UserAvatar user={submission.author} size={28} />
          <h3 className="break-all italic text-sm">
            <UsernameDisplay user={submission.author} />
          </h3>
          {totalVotes.greaterThan(0) ? (
            <span className="ml-auto text-t2 text-sm font-medium">
              {formatDecimal(totalVotes.toString()).short} votes
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>
    );
};

const RenderTextSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <div className="relative h-full w-full min-h-[330px] rounded-xl text-t1 gap-1">
      <div className="p-2 w-full h-full flex flex-col gap-1 transition-transform duration-300 ease-in-out will-change-transform">
        <h2 className="break-word font-bold text-xl">
          {submission.data.title}
        </h2>
        <div className="w-full flex items-center gap-2 flex-wrap font-semibold text-sm text-t2">
          <UserAvatar user={submission.author} size={28} />
          <h3 className="break-all italic text-sm ">
            <UsernameDisplay user={submission.author} />
          </h3>
        </div>
        <section className="break-word max-h-[18em] overflow-hidden">
          {submission.type === "twitter" ? (
            <div className="grid grid-cols-1">
              <ParseThread thread={submission.data.thread} omitImages={true} />
            </div>
          ) : (
            <div className="grid grid-cols-1">
              <ParseBlocks data={submission.data.body} omitImages={true} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const RenderVideoSubmission = ({
  submission,
  isActive,
}: {
  submission: Submission;
  isActive: boolean;
}) => {
  const videoUrl =
    submission.type === "twitter"
      ? submission.data.thread[0].videoAsset
      : submission.data.videoAsset;
  const posterUrl =
    submission.type === "twitter"
      ? submission.data.thread[0].previewAsset
      : submission.data.previewAsset;

  return (
    <RenderInteractiveVideoWithLoader {...{ videoUrl, posterUrl, isActive }} />
  );
};

const RenderImageSubmission = ({ submission }) => {
  return (
    <ImageWrapper>
      <Image
        src={
          submission.type === "standard"
            ? submission.data.previewAsset
            : submission.data.thread[0].previewAsset
        }
        draggable={false}
        alt="submission image"
        fill
        sizes="30vw"
        className="object-cover w-full h-full transition-transform duration-300 ease-in-out rounded-xl"
      />
    </ImageWrapper>
  );
};

// used to render a preview in the submission dialog
export const SimplePreview = ({ submission }: { submission: Submission }) => {
  const [isActive, setIsActive] = useState(false);
  const isMobileDevice = isMobile();
  useEffect(() => {
    if (isMobileDevice) {
      setIsActive(true);
    }
  }, [isMobileDevice]);

  return (
    <div
      className="w-full h-full p-2 shadow-black shadow-sm cursor-pointer flex flex-col justify-between rounded-xl bg-base-100 border border-border no-select transform 
      transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform"
      onMouseEnter={() => !isMobileDevice && setIsActive(true)}
      onMouseLeave={() => !isMobileDevice && setIsActive(false)}
      draggable={false}
    >
      <SubmissionBody submission={submission} />
      {submission.data.type === "image" && (
        <RenderImageSubmission submission={submission} />
      )}
      {submission.data.type === "video" && (
        <RenderVideoSubmission submission={submission} isActive={isActive} />
      )}
      {submission.data.type === "text" && (
        <RenderTextSubmission submission={submission} />
      )}
    </div>
  );
};

const CardSubmission = ({
  submission,
  footerChildren,
  interactive = false,
  handleCardClick,
}: {
  submission: Submission;
  footerChildren?: React.ReactNode;
  interactive?: boolean;
  handleCardClick: (submission: Submission, mode: "expand" | "mint") => void;
}) => {
  const isMobileDevice = isMobile();

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (inView && isMobileDevice) {
      setIsActive(true);
    }
  }, [inView, isMobileDevice]);

  
  return (
    <div
      className="relative w-full h-full cursor-pointer p-2 shadow-black shadow-sm flex flex-col justify-between rounded-xl bg-base-100 border border-border no-select transform
      transition-transform duration-300 hoverCard will-change-transform"
      ref={ref}
      onMouseEnter={() => !isMobileDevice && setIsActive(true)}
      onMouseLeave={() => !isMobileDevice && setIsActive(false)}
      onClick={() => handleCardClick(submission, "expand")}
    >
      {submission.rank && (
        <TbCrown
          className="absolute -top-3 -right-3 w-8 h-8 text-yellow-600"
          fill="#facc15"
        />
      )}

      <SubmissionBody submission={submission} />
      {submission.data.type === "image" && (
        <RenderImageSubmission submission={submission} />
      )}
      {submission.data.type === "video" && (
        <RenderVideoSubmission submission={submission} isActive={isActive} />
      )}
      {submission.data.type === "text" && (
        <RenderTextSubmission submission={submission} />
      )}
      {footerChildren}
    </div>
  );
};

export default CardSubmission;
