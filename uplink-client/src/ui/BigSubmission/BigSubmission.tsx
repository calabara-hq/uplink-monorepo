"use client";
import Output from "editorjs-react-renderer";
import Image from "next/image";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";
import { Submission } from "@/providers/ContestInteractionProvider";
import { SubmissionTypeBadge } from "../SubmissionBadges/SubmissionBadges";
import { BiBorderRadius } from "react-icons/bi";
// const BigSubmission = ({ submission }: { submission: Submission }) => {
//   if (submission.data.type === "text") {
//     return (<div>
//       <RenderTitle submission={submission} />
//     <RenderSubmissionBody submission={submission} />
//     </div>);
//   }
//   if (submission.data.type === "image") {
//     return (
//       <div>
//         <RenderBigImageSubmission submission={submission} />
//         <RenderSubmissionBody submission={submission} />
//       </div>
//     );
//   }
//   if (submission.data.type === "video") {
//     return (
//       <div>
//         <RenderBigVideoSubmission submission={submission} />
//         <RenderSubmissionBody submission={submission} />
//       </div>
//     );
//   }

//   return null;
// };

const BigSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <div className="flex flex-col w-full h-full items-center gap-4">
      <h2 className="text-3xl">{submission.data.title}</h2>
       <h3 className="lg:text-xl">{submission.author ?? "anonymous"}</h3>
      {submission.data.type === "video" && (
        <RenderBigVideoSubmission submission={submission} />
      )}
      {submission.data.type === "image" && (
        <RenderBigImageSubmission submission={submission} />
      )}
      <RenderSubmissionBody submission={submission} />
    </div>
  );
};

const RenderTitle = ({ submission }: { submission: Submission }) => {
  return (
    <div className="">
      <p className="text-3xl">{submission.data.title}</p>
    </div>
  );
};

const RenderSubmissionBody = ({ submission }: { submission: Submission }) => {
  return (
    <div className="">
      <section className="break-word">
        {submission.type === "twitter" ? (
          <p className="">{submission.data.thread[0].text}</p>
        ) : (
          <Output data={submission.data.body} />
        )}
      </section>
    </div>
  );
};

const RenderBigImageSubmission = ({
  submission,
}: {
  submission: Submission;
}) => {
  console.log(submission);
  return (
    <div className="relative w-full h-1/2">
      {/* <Image
        src={
          submission.type === "standard"
            ? submission.data.previewAsset
            : submission.data.thread[0].previewAsset
        }
        alt="submission image"
        style={{width: "50%", height: "auto"}}
        width={500}
        height={500}
        className="rounded-xl "
      /> 
      */}
      <Image
        src={
          submission.type === "standard"
            ? submission.data.previewAsset
            : submission.data.thread[0].previewAsset
        }
        alt="submission image"
        //style={{borderRadius: "12px"}}
        fill
        className="rounded-xl object-contain"
      />
      
    </div>
  );
};

const RenderBigVideoSubmission = ({
  submission,
}: {
  submission: Submission;
}) => {
  return (
    <MediaController className="aspect-video-16:9">
      <video
        slot="media"
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
        className="rounded-t-xl w-full object-cover"
      />
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <MediaMuteButton></MediaMuteButton>
      </MediaControlBar>
    </MediaController>
  );
};

export default BigSubmission;
