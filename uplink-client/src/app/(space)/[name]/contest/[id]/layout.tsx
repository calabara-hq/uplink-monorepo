import { ContestStateProvider } from "@/providers/ContestStateProvider";
import fetchContest from "@/lib/fetch/fetchContest";
import { ContestInteractionProvider } from "@/providers/ContestInteractionProvider";

import SwrProvider from "@/providers/SwrProvider";
import { VoteActionProvider } from "@/providers/VoteActionProvider";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";

export default async function Layout({
  params,
  children,
  modal,
}: {
  params: { id: string; name: string };
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const contestId = params.id;
  const [contest, submissions] = await Promise.all([
    fetchContest(contestId),
    fetchSubmissions(contestId),
  ]);

  const fallback = {
    [`submissions/${contestId}`]: submissions,
  };

  const { metadata, deadlines, space, tweetId } = contest;
  return (
    <div className="w-full flex flex-col items-center p-4">
      <ContestStateProvider
        deadlines={deadlines}
        metadata={metadata}
        tweetId={tweetId}
        contestAdmins={space.admins.map((admin) => admin.address)}
      >
        <SwrProvider fallback={fallback}>
          <ContestInteractionProvider contestId={contestId}>
            <VoteActionProvider contestId={contestId}>
              {children}
              {modal}
            </VoteActionProvider>
          </ContestInteractionProvider>
        </SwrProvider>
      </ContestStateProvider>
    </div>
  );
}
