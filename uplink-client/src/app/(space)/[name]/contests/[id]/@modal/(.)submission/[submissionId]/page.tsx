import SubmissionModal from "./submissionModal";

const getSubmissions = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Query($contestId: ID!){
        contest(contestId: $contestId){
            submissions {
                id
                contestId
                author
                created
                type
                url
                version
            }
        }
    }`,
      variables: {
        contestId,
      },
    }),
    next: { tags: [`submissions/${contestId}`], revalidate: 60 }, // cache submissions for 60 seconds
  })
    .then((res) => res.json())
    .then((res) => res.data.contest.submissions);
  return data;
};

const fetchSubmission = async (url: string) => {
  return fetch(url).then((res) => res.json()); // cache every submission request as we don't yet allow editing
};

const fetchAndMergeSubmissionData = async (submissionRef: any | null) => {
  if (!submissionRef) {
    return null;
  }

  const data = await fetchSubmission(submissionRef.url);

  return {
    ...submissionRef,
    ...data,
  };
};

export default async function SubmissionPage({
  params: { id, submissionId },
}: {
  params: { id: string; submissionId: string };
}) {
  const submissions = await getSubmissions(id);
  const currSubmissionIndex = submissions.findIndex(
    (submission) => submission.id === submissionId
  );

  const prevSubmissionRef =
    currSubmissionIndex > 0 ? submissions[currSubmissionIndex - 1] : null;
  const currSubmissionRef = submissions[currSubmissionIndex];
  const nextSubmissionRef =
    currSubmissionIndex < submissions.length - 1
      ? submissions[currSubmissionIndex + 1]
      : null;

  const [prevSubmission, submission, nextSubmission] = await Promise.all([
    fetchAndMergeSubmissionData(prevSubmissionRef),
    fetchAndMergeSubmissionData(currSubmissionRef),
    fetchAndMergeSubmissionData(nextSubmissionRef),
  ]);

  return (
    <SubmissionModal
      submission={submission!}
      submissions={submissions}
      prevSubmission={prevSubmission}
      nextSubmission={nextSubmission}
      index={currSubmissionIndex}
    />
  );
}
