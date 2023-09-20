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
import { ImageWrapper, VideoWrapper } from "./MediaWrapper";
import { TbCrown } from "react-icons/tb";
import { ParseThread } from "@/lib/threadParser";

const SubmissionBody = ({ submission }: { submission: Submission }) => {
  if (submission.data.type !== "text")
    return (
      <div className="relative flex flex-col gap-2 rounded-b-lg w-full p-2 ">
        <h2 className="text-lg font-semibold">{submission.data.title}</h2>
        <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
          <UserAvatar address={submission.author} size={28} />
          <h3 className="break-all italic text-sm">
            <AddressOrEns address={submission.author} />
          </h3>
        </div>
      </div>
    );
};

const RenderTextSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <div className="relative h-full w-full min-h-[330px] rounded-xl text-white/80 gap-1">
      <div className="p-2 w-full h-full flex flex-col gap-1 transition-transform duration-300 ease-in-out will-change-transform">
        <h2 className="break-word font-bold text-xl">
          {submission.data.title}
        </h2>
        <div className="w-full flex items-center gap-2 flex-wrap font-semibold text-sm text-t2">
          <UserAvatar address={submission.author} size={28} />
          <h3 className="break-all italic text-sm ">
            <AddressOrEns address={submission.author} />
          </h3>
        </div>
        <section className="break-word">
          {submission.type === "twitter" ? (
            <div className="grid grid-cols-1 line-clamp-[8] lg:line-clamp-[12]">
              {ParseThread({ thread: submission.data.thread, omitImages: true })}
            </div>
          ) : (
            <div className="grid grid-cols-1 line-clamp-[8] lg:line-clamp-[12]">
              {ParseBlocks({ data: submission.data.body, omitImages: true })}
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
  const vidRef = useRef<HTMLVideoElement>(null);

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
    <VideoWrapper>
      <MediaController className="w-full h-full rounded-xl">
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
          className="rounded-xl object-cover h-full w-full transition-transform duration-300 ease-in-out "
        />

        <div slot="top-chrome" className="flex flex-row w-full mt-2">
          {isActive ? (
            <MediaMuteButton
              ref={muteButtonRef}
              className="bg-[#1c1c1ca6] hover:bg-[#1c1c1ce6] ml-auto mr-2 rounded-xl p-2"
            >
              <span slot="high">
                <HiOutlineVolumeUp className="h-6 w-6 text-t1" />
              </span>
              <span slot="off">
                <HiOutlineVolumeOff className="h-6 w-6 text-t1" />
              </span>
            </MediaMuteButton>
          ) : (
            <MediaPlayButton className="bg-[#1c1c1ce6] ml-auto mr-2 rounded-xl p-2">
              <span slot="play">
                <MdOutlineOndemandVideo className="h-6 w-6 text-warning" />
              </span>
            </MediaPlayButton>
          )}
        </div>

        <div className="flex flex-row w-full items-end bg-gradient-to-t from-[black] rounded-b-xl h-20">
          <MediaTimeDisplay
            ref={timeRef}
            className="ml-auto mr-2 rounded-xl p-1 bg-transparent text-t1"
            showDuration={isActive}
            remaining={!isActive}
          >
            {/* {!isActive && <slot>{duration}</slot>} */}
          </MediaTimeDisplay>
        </div>
      </MediaController>
    </VideoWrapper>
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
      className="relative w-full h-full p-2 shadow-black shadow-sm flex flex-col justify-between rounded-xl bg-base-100 border border-border no-select transform 
      transition-transform duration-300 hoverCard will-change-transform"
      ref={ref}
      href={`${basePath}/submission/${submission.id}`}
      onMouseEnter={() => !isMobileDevice && setIsActive(true)}
      onMouseLeave={() => !isMobileDevice && setIsActive(false)}
      draggable={false}
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
    </Link>
  );
};

export default CardSubmission;
