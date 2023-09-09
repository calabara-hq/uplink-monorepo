import SubmissionModal from "./submissionModal";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";

const fetchAndMergeSubmissionData = async (submissionRef: any | null) => {
  if (!submissionRef) {
    return null;
  }

  const data = await fetchSubmissions(submissionRef.url);

  return {
    ...submissionRef,
    ...data,
  };
};

export default async function SubmissionPage({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  const submissions = await fetchSubmissions(id);
  const currSubmissionIndex = submissions.findIndex(
    (submission) => submission.id === submissionId
  );

  const currSubmission = submissions[currSubmissionIndex];
  const prevSubmission = submissions[currSubmissionIndex - 1] || null;
  const nextSubmission = submissions[currSubmissionIndex + 1] || null;

  // const prevSubmissionRef =
  //   currSubmissionIndex > 0 ? submissions[currSubmissionIndex - 1] : null;
  // const currSubmissionRef = submissions[currSubmissionIndex];
  // const nextSubmissionRef =
  //   currSubmissionIndex < submissions.length - 1
  //     ? submissions[currSubmissionIndex + 1]
  //     : null;

  return (
    <SubmissionModal
      spaceName={name}
      contestId={id}
      submission={currSubmission}
      submissions={submissions}
      prevSubmission={prevSubmission}
      nextSubmission={nextSubmission}
      index={currSubmissionIndex}
    />
  );
}
