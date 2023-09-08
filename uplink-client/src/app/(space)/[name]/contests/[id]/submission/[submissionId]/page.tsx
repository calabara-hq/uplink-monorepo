import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";

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

export default async function SubmissionPage({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  const submission = await getSubmission(submissionId);
  submission.data = await fetch(submission.url).then((res) => res.json());
  return (
    <div className="grid grid-cols-1 w-full gap-2 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full">
      <Link href={`/${name}/contests/${id}`} className="mr-auto">
        <HiArrowNarrowLeft className="w-6 h-6" />
      </Link>
      <ExpandedSubmission submission={submission} />
    </div>
  );
}
