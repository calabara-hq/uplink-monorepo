import Link from "next/link";
import Image from "next/image";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Submission } from "@/providers/ContestInteractionProvider";
import BigSubmission from "@/ui/BigSubmission/BigSubmission";

const getSubmission = async (submissionId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query submission($submissionId: ID!){
          submission(submissionId: $submissionId) {
            author
            created
            rank
            totalVotes
            type
            url
            version
          }
      }`,
      variables: {
        submissionId,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.submission);
  return data;
};

const ExpandedSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <div className="flex flex-col items-center w-3/4 h-screen border-2 border-border shadow-box gap-4 p-4 rounded-xl">
      <p className="text-3xl mr-auto">{submission.data.title}</p>
      {submission.data.type === "video" && (
        <>
          <video controls src={submission.url} />
        </>
      )}
      {submission.data.type === "image" && (
        <div className="relative flex flex-col w-full h-1/3 lg:w-2/5 lg:h-1/2 items-center">
          {/* <Image
              src={
                submission.type === "standard"
                  ? submission.data.previewAsset
                  : submission.data.thread[0].previewAsset
              }
              alt="submission image"
              fill
              className="rounded-xl "
            />  */}
          <p>body</p>
        </div>
      )}
      {submission.data.type === "text" && (
        <>
          <p>{submission.data.title}</p>
        </>
      )}
    </div>
  );
};

export default async function SubmissionPage({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  const submission = await getSubmission(submissionId);
  submission.data = await fetch(submission.url).then((res) => res.json());
  console.log(submission);
  return (
    <div className="flex flex-col h-screen items-center w-full gap-4">
      <Link className="btn btn-ghost mr-auto" href={`/${name}/contests/${id}`}>
        <HiArrowNarrowLeft className="h-6 w-6 mr-1" />
        Back to Contest
      </Link>
      {/* <ExpandedSubmission submission={submission} /> */}
      <div className="flex flex-col h-full w-full lg:w-3/4 items-center gap-4">
        <BigSubmission submission={submission} />
      </div>
    </div>
  );
}
