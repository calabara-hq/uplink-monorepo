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

const SubmissionBody = ({ submission, isActive, voteActions }) => {
  if (submission.data.type !== "text")
    return (
      <div className="relative rounded-b-lg w-full p-2 pb-10 ">
        <h2 className="text-lg font-semibold">{submission.data.title}</h2>
        <div className="w-full gap-2 flex items-center">
          <h3>{submission.data.author ?? "anonymous"}</h3>
          {new Decimal(submission.totalVotes ?? "0").greaterThan(0) ? (
            <div className="flex items-center justify-center">
              <div className="badge rounded badge-warning">
                {submission.totalVotes} votes
              </div>
            </div>
          ) : (
            <span /> // placeholder
          )}
        </div>
        <SubmissionFooter
          submission={submission}
          voteActions
          isActive={isActive}
        />
      </div>
    );
};

const RenderTextSubmission = ({
  submission,
  isActive,
  voteActions,
}: {
  submission: Submission;
  isActive: boolean;
  voteActions: VoteActionProps;
}) => {
  return (
    <div className="relative h-full w-full bg-white/90 rounded-xl text-black/80 gap-1 p-2">
      <div
        className={`p-2 w-full h-full flex flex-col transition-transform duration-300 ease-in-out will-change-transform ${
          isActive ? "zoomIn" : ""
        }`}
      >
        <h2 className="break-word font-bold text-2xl">
          {submission.data.title}
        </h2>
        <h3 className="break-all italic">
          {submission.author ?? "anonymous"}{" "}
        </h3>
        <section className="break-word">
          {submission.type === "twitter" ? (
            <p className="line-clamp-[8] lg:line-clamp-[12]">
              {submission.data.thread[0].text}
            </p>
          ) : (
            <Output data={submission.data.body} />
          )}
        </section>
      </div>
      <SubmissionFooter
        submission={submission}
        isActive={isActive}
        voteActions={voteActions}
      />
    </div>
  );
};

// const RenderImageSubmission = ({
//   submission,
//   isActive,
//   voteActions,
// }: {
//   submission: Submission;
//   isActive: boolean;
//   voteActions: VoteActionProps;
// }) => {
//   return (
//     <div className="flex flex-col w-full h-full">
//       <figure className="relative h-64 w-full overflow-hidden rounded-t-xl">
//         <Image
//           src={
//             submission.type === "standard"
//               ? submission.data.previewAsset
//               : submission.data.thread[0].previewAsset
//           }
//           alt="submission image"
//           fill
//           className={`object-cover w-full h-full transition-transform duration-300 ease-in-out ${
//             isActive ? "zoomIn" : ""
//           }`}
//         />
//       </figure>
//       <SubmissionBody
//         submission={submission}
//         isActive={isActive}
//         voteActions={voteActions}
//       />
//     </div>
//   );
// };

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

const SubmissionFooter = ({ submission, voteActions, isActive }) => {
  const { contestState } = useContestState();
  if (isActive && voteActions && contestState === "voting")
    return (
      <div className="animate-springUp flex absolute bottom-0 left-0 items-end w-full h-8 rounded-b-lg bg-secondary">
        <AddToCartButton submission={submission} voteActions={voteActions} />
      </div>
    );
  return null;
};

const AddToCartButton = ({ submission, voteActions }) => {
  const { addProposedVote, currentVotes, proposedVotes } = voteActions;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(
      [...currentVotes, ...proposedVotes].some(
        (vote) => vote.submissionId === submission.id
      )
    );
  }, [currentVotes, proposedVotes, submission.id]);

  const handleSelect = () => {
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <button className=" btn btn-ghost btn-sm cursor-default no-animation ml-auto">
        <HiCheckBadge className="h-6 w-6 text-black" />
      </button>
    );
  } else
    return (
      <button className=" btn btn-ghost btn-sm ml-auto" onClick={handleSelect}>
        <HiPlus className="h-6 w-6 text-black" />
      </button>
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
  voteActions,
}: {
  submission: Submission;
  basePath: string;
  voteActions?: VoteActionProps;
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
      className="flex flex-col bg-blue-800 rounded-lg"
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
          voteActions={voteActions}
        />
      )}
      <SubmissionBody
        submission={submission}
        isActive={isActive}
        voteActions={voteActions}
      />
    </Link>
  );
};

// // voteActions is optional because it's only used in the contest page
// const CardSubmission2 = ({
//   submission,
//   basePath,
//   voteActions,
// }: {
//   submission: Submission;
//   basePath: string;
//   voteActions?: VoteActionProps;
// }) => {
//   const [isActive, setIsActive] = useState(false);
//   return (
//     <Link
//       className={`relative h-full w-full rounded-lg shadow-md border-border bg-base-100 ${
//         submission.rank ? "border-yellow-600" : "border-border"
//       }`}
//       href={`${basePath}/submission/${submission.id}`}
//       onMouseEnter={() => setIsActive(true)}
//       onMouseLeave={() => setIsActive(false)}
//     >
//       {/* {submission.rank && (
//           <span className="absolute flex items-center justify-center -top-0 -right-0 z-10 ">
//             <div className="relative">
//               <FaBurst className="w-10 h-10 absolute text-yellow-400 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//               <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-bold text-xl">
//                 {submission.rank}
//               </p>
//             </div>
//           </span>
//         )} */}
//       {submission.data.type === "video" && (
//         <RenderVideoSubmission submission={submission} isActive={isActive} />
//       )}
//       {submission.data.type === "image" && (
//         <RenderImageSubmission2
//           submission={submission}
//           isActive={isActive}
//           voteActions={voteActions}
//         />
//       )}
//       {submission.data.type === "text" && (
//         <RenderTextSubmission submission={submission} />
//       )}
//     </Link>
//   );
// };

export default CardSubmission;
