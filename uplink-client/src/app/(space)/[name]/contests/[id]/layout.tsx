import { ContestStateProvider } from "@/providers/ContestStateProvider";
import { VoteProposalProvider } from "@/providers/VoteProposalProvider";
import { getContestById } from "./fetchContest";
import { ContestInteractionProvider } from "@/providers/ContestInteractionProvider";
import SwrProvider from "@/providers/SwrProvider";
import { VoteActionProvider } from "@/providers/VoteActionProvider";

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
                totalVotes
                rank
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
    .then((res) => res.data.contest.submissions)
    .then(async (submissions) => {
      return await Promise.all(
        submissions.map(async (submission, idx) => {
          const data = await fetch(submission.url).then((res) => res.json());
          return { ...submission, data: data };
        })
      );
    });
  return data;
};

export default async function Layout({
  children,
  params,
  modal,
}: {
  children: React.ReactNode;
  params: { name: string; id: string };
  modal: React.ReactNode;
}) {
  // TODO: combine these 2 queries into 1 with relational query
  const contest = await getContestById(params.id);
  const submissions = await getSubmissions(params.id);

  const fallback = {
    [`submissions/${params.id}`]: submissions,
  };

  const { deadlines, metadata, tweetId, space } = contest;
  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="flex justify-center gap-6 m-auto w-full lg:py-6">
        <ContestStateProvider
          deadlines={deadlines}
          metadata={metadata}
          tweetId={tweetId}
          contestAdmins={space.admins.map((admin) => admin.address)}
        >
          <SwrProvider fallback={fallback}>
            <ContestInteractionProvider contestId={params.id}>
              <VoteActionProvider contestId={params.id}>
                {children}
              </VoteActionProvider>
            </ContestInteractionProvider>
          </SwrProvider>
        </ContestStateProvider>
        {/* {modal} */}
      </div>
    </div>
  );
}
