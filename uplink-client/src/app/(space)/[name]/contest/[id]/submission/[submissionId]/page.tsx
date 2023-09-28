import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import { Submission } from "@/providers/ContestInteractionProvider";
import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { submissionId: string };
}): Promise<Metadata> {
  const submissionId = params.submissionId;
  const submission = await fetchSingleSubmission(submissionId);
  return {
    title: `${submission.data.title}`,
    description: `${submission.data.title} on Uplink`,
    openGraph: {
      title: `${submission.data.title}`,
      description: `${submission.data.title} on Uplink`,
      images: [
        {
          url: `api/submission/${submissionId}/submission_metadata`,
          width: 600,
          height: 600,
          alt: `my submission`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

const ExpandedSubmissionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="w-64 h-8 bg-base-100 shimmer rounded-lg" />
        <div className="flex flex-row items-center h-8">
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 bg-base-100 shimmer rounded-xl" />
            <div className="w-16 h-4 bg-base-100 shimmer rounded-lg" />
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-200" />
      {/* <SubmissionRenderer submission={submission} /> */}
      <div className="w-96 m-auto h-96 bg-base-100 shimmer rounded-lg" />
    </div>
  );
};

// extract this out so we can suspend it
const PageContent = async ({
  submissionId,
}: {
  spaceName: string;
  contestId: string;
  submissionId: string;
}) => {
  const submission = await fetchSingleSubmission(submissionId);
  return <ExpandedSubmission submission={submission} />;
};

export default async function Page({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  return (
    <div className="grid grid-cols-1 w-full gap-6 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full">
      <Link
        href={`/${name}/contest/${id}`}
        draggable={false}
        className="mr-auto flex gap-2 text-t2 hover:text-t1"
      >
        <HiArrowNarrowLeft className="w-6 h-6" />
        <p>To contest</p>
      </Link>
      <Suspense fallback={<ExpandedSubmissionSkeleton />}>
        {/*@ts-expect-error*/}
        <PageContent
          spaceName={name}
          contestId={id}
          submissionId={submissionId}
        />
      </Suspense>
    </div>
  );
}
