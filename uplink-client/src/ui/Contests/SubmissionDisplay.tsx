import { getContestById } from "@/lib/fetch/contest";
import { VideoProvider } from "@/providers/VideoProvider";
//import VideoPreview from "../VideoPlayer/VideoPlayer";
import { Suspense } from "react";
import { VideoSubmissionCard } from "./SubmissionCard";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";
import SubmissionVoteButton from "./SubmissionVoteButton";

const VideoPreview = dynamic(() => import("../VideoPlayer/VideoPlayer"), {
  loading: () => <SubmissionSkeleton />,
});

const fetchSubmission = async (url: string) => {
  console.log("fetching submission from", url);
  return fetch(url, { cache: "no-store" }).then((res) => res.json());
};

const SubmissionDisplay = async ({ contestId }) => {
  const contest = await getContestById(contestId);
  const { submissions } = contest.data.contest;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl lg:text-3xl text-center font-bold">Submissions</h1>
      <div className="flex w-full justify-evenly items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-evenly gap-4 lg:w-full w-full">
          {submissions.map(async (submission, idx) => {
            const data = await fetchSubmission(submission.url);
            return (
              <RenderSubmission
                data={{ ...data, id: submission.id }}
                key={idx}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RenderSubmission = ({ data }: { data: any }) => {
  return (
    <div className="card card-compact min-w-64 h-96 cursor-pointer">
      {data.type === "video" && <RenderVideoSubmission data={data} />}
      {data.type === "image" && <RenderImageSubmission data={data} />}
      {data.type === "text" && <RenderTextSubmission data={data} />}
      <SubmissionVoteButton data={data}/>
    </div>
  );
};

const RenderTextSubmission = ({ data }) => {
  return (
    <>
      <div className="card-body h-32 bg-base-100 rounded-xl">
        <h2 className="card-title">
          Hi fam, I made a cardboard mask craft for an unminted chocolate head
          cosplay 🍫🔥 @thenounsquare @nounsdao A video of the process below⬇️
        </h2>
        <p>
          is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy text ever since the
        </p>
      </div>
    </>
  );
};

const RenderImageSubmission = ({ data }) => {
  return (
    <>
      <figure className="relative h-64 w-full">
        <Image
          src={data.previewAsset}
          alt="submission image"
          fill
          className="rounded-t-xl object-cover w-full"
        />
      </figure>
      <div className="card-body h-32 rounded-b-xl bg-base-100">
        <h2 className="card-title">{data.title}</h2>
      </div>
    </>
  );
};

const RenderVideoSubmission = ({ data }) => {
  return (
    <VideoProvider>
      <>
        <figure className="relative bg-base-100 h-64 w-full">
          <VideoPreview
            url={data.videoAsset}
            thubmnailUrl={data.previewAsset}
            id={data.id}
          />
        </figure>
        <div className="card-body h-32 rounded-b-xl bg-base-100">
          <h2 className="card-title">{data.title}</h2>
        </div>
      </>
    </VideoProvider>
  );
};

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

const SubmissionSkeleton = () => {
  return (
    <div className="col-span-4 space-y-4 lg:col-span-1">
      <div className={`relative h-[167px] rounded-xl bg-gray-900 ${shimmer}`} />

      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-6 w-1/3 rounded-lg bg-gray-900" />
      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-4 w-4/6 rounded-lg bg-gray-900" />
    </div>
  );
};

export const SubmissionDisplaySkeleton = () => {
  return (
    <div className="space-y-6 pb-[5px]">
      <div className="space-y-2">
        <div className={`h-6 w-1/3 rounded-lg bg-gray-900 ${shimmer}`} />
        <div className={`h-4 w-1/2 rounded-lg bg-gray-900 ${shimmer}`} />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <SubmissionSkeleton />
        <SubmissionSkeleton />
        <SubmissionSkeleton />
        <SubmissionSkeleton />
      </div>
    </div>
  );
};

export default SubmissionDisplay;
