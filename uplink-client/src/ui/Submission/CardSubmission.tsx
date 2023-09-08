// Render the submission in a card format. This is used in the contest page + the homepage.
"use client";
import { Submission } from "@/providers/ContestInteractionProvider";
import { VoteActionProps } from "@/providers/VoteActionProvider";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
  MediaTextDisplay,
} from "media-chrome/dist/react";
import Output from "editorjs-react-renderer";
import { useEffect, useRef, useState } from "react";
import { HiCheckBadge, HiPlus } from "react-icons/hi2";
import { Decimal } from "decimal.js";
import { isMobile } from "@/lib/isMobile";
import useVideoControls from "@/hooks/useVideoControls";
import { FaVolumeHigh } from "react-icons/fa6";
import { FaVolumeMute } from "react-icons/fa";
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { useContestState } from "@/providers/ContestStateProvider";
import { AddressOrEns, UserAvatar } from "../AddressDisplay/AddressDisplay";
import { ParseBlocks } from "@/lib/blockParser";

const SubmissionBody = ({
  submission,
  footerChildren,
}: {
  submission: Submission;
  footerChildren: React.ReactNode;
}) => {
  if (submission.data.type !== "text")
    return (
      <div className="relative flex flex-col gap-2 rounded-b-lg w-full p-2 pb-10 ">
        <h2 className="text-lg font-semibold">{submission.data.title}</h2>
        <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
          <UserAvatar address={submission.author} size={28} />
          <h3 className="break-all italic text-sm">
            <AddressOrEns address={submission.author} />
          </h3>
          {/* {new Decimal(submission.totalVotes ?? "0").greaterThan(0) ? (
            <div className="badge rounded badge-warning font-semibold ml-auto">
              {submission.totalVotes} votes
            </div>
          ) : (
            <span /> // placeholder
          )} */}
        </div>
        {footerChildren}
      </div>
    );
};

const RenderTextSubmission = ({
  submission,
  isActive,
  footerChildren,
}: {
  submission: Submission;
  isActive: boolean;
  footerChildren?: React.ReactNode;
}) => {
  console.log(submission);
  return (
    <div className="relative h-full w-full min-h-[330px] rounded-xl text-white/80 gap-1 p-2">
      <div
        className={`p-2 w-full h-full flex flex-col gap-1 transition-transform duration-300 ease-in-out will-change-transform ${
          isActive ? "zoomIn" : ""
        }`}
      >
        <h2 className="break-word font-bold text-xl">
          {submission.data.title}
        </h2>
        <div className="w-full flex items-center gap-2 flex-wrap font-semibold text-sm text-t2">
          <UserAvatar address={submission.author} size={28} />
          <h3 className="break-all italic text-sm ">
            <AddressOrEns address={submission.author} />
          </h3>
          {/* {new Decimal(submission.totalVotes ?? "0").greaterThan(-1) ? ( //TODO: change this back to 0
            <div className="badge rounded badge-warning font-semibold">
              {submission.totalVotes} votes
            </div>
          ) : (
            <span /> // placeholder
          )} */}
        </div>
        <section className="break-word">
          {submission.type === "twitter" ? (
            <p className="line-clamp-[8] lg:line-clamp-[12]">
              {submission.data.thread[0].text}
            </p>
          ) : (
            //<Output data={submission.data.body} />
            <div className="grid grid-cols-1 line-clamp-[8] lg:line-clamp-[12]">
              {ParseBlocks({ data: submission.data.body, omitImages: false })}
            </div>
          )}
        </section>
      </div>
      {footerChildren}
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
  const vidRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState("00:00");

  useEffect(() => {
    if (vidRef?.current?.duration)
      setDuration(
        new Date(vidRef.current.duration * 1000).toISOString().slice(14, 19)
      );
  }, [vidRef]);

  useEffect(() => {
    if (isActive && vidRef.current) vidRef.current.play();
    else if (!isActive && vidRef.current) vidRef.current.pause();
  }, [isActive]);

  const { muteButtonRef, timeRef } = useVideoControls({
    onMute: (event: Event) => {
      event.stopPropagation();
      event.preventDefault();
    },
    onTimeToggle: (event: Event) => {
      event.stopPropagation();
      event.preventDefault();
    },
  });

  return (
    <MediaWrapper>
      <MediaController className="w-full h-full rounded-t-lg">
        <video
          ref={vidRef}
          autoPlay={isActive}
          playsInline
          slot="media"
          loop={true}
          src={
            submission.type === "twitter"
              ? submission.data.thread[0].videoAsset
              : submission.data.videoAsset
          }
          poster={
            submission.type === "twitter"
              ? submission.data.thread[0].previewAsset
              : submission.data.previewAsset
          }
          preload="auto"
          muted
          crossOrigin=""
          className={`rounded-t-lg h-full w-full object-cover transition-transform duration-300 ease-in-out ${
            isActive ? "zoomIn" : ""
          }`}
        />

        <div slot="top-chrome" className="flex flex-row w-full mt-2">
          {isActive ? (
            <MediaMuteButton
              ref={muteButtonRef}
              className="bg-[#1c1c1ca6] hover:bg-[#1c1c1ce6] ml-auto mr-2 rounded-md p-2"
            >
              <span slot="high">
                <HiOutlineVolumeUp className="h-6 w-6 text-t1" />
              </span>
              <span slot="off">
                <HiOutlineVolumeOff className="h-6 w-6 text-t1" />
              </span>
            </MediaMuteButton>
          ) : (
            <MediaPlayButton className="bg-[#1c1c1ce6] ml-auto mr-2 rounded-md p-2">
              <span slot="play">
                <MdOutlineOndemandVideo className="h-6 w-6 text-warning" />
              </span>
            </MediaPlayButton>
          )}
        </div>

        <div className="flex flex-row w-full items-end bg-gradient-to-t from-[black] h-20 pb-1">
          <MediaTimeDisplay
            ref={timeRef}
            className="ml-auto mr-2 rounded-md p-1 bg-transparent text-t1"
            showDuration={isActive}
          >
            {!isActive && <slot>{duration}</slot>}
          </MediaTimeDisplay>
        </div>
      </MediaController>
    </MediaWrapper>
  );
};

const MediaWrapper = ({ children }) => {
  return (
    <div className="relative media-grid-item">
      <figure className="absolute inset-0 overflow-hidden rounded-t-xl">
        {children}
      </figure>
    </div>
  );
};

const RenderImageSubmission = ({ submission, isActive }) => {
  return (
    <MediaWrapper>
      <Image
        src={
          submission.type === "standard"
            ? submission.data.previewAsset
            : submission.data.thread[0].previewAsset
        }
        alt="submission image"
        fill
        className={`object-contain w-full h-full transition-transform duration-300 ease-in-out ${
          isActive ? "zoomIn" : ""
        }`}
      />
    </MediaWrapper>
  );
};

const CardSubmission = ({
  submission,
  basePath,
  footerChildren,
}: {
  submission: Submission;
  basePath: string;
  footerChildren?: React.ReactNode;
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
    <Link
      className="flex flex-col rounded-xl bg-base-100 border border-border"
      ref={ref}
      href={`${basePath}/submission/${submission.id}`}
      onMouseEnter={() => !isMobileDevice && setIsActive(true)}
      onMouseLeave={() => !isMobileDevice && setIsActive(false)}
      draggable={false}
    >
      {submission.data.type === "image" && (
        <RenderImageSubmission submission={submission} isActive={isActive} />
      )}
      {submission.data.type === "video" && (
        <RenderVideoSubmission submission={submission} isActive={isActive} />
      )}
      {submission.data.type === "text" && (
        <RenderTextSubmission
          submission={submission}
          isActive={isActive}
          footerChildren={isActive ? footerChildren : null}
        />
      )}
      <SubmissionBody
        submission={submission}
        footerChildren={isActive ? footerChildren : null}
      />
    </Link>
  );
};

export default CardSubmission;
