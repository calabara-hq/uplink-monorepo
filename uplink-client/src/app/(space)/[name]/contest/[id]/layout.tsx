import { ContestStateProvider } from "@/providers/ContestStateProvider";
import { getContestById } from "./fetchContest";
import { ContestInteractionProvider } from "@/providers/ContestInteractionProvider";

import SwrProvider from "@/providers/SwrProvider";
import { VoteActionProvider } from "@/providers/VoteActionProvider";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";

export default async function Layout({
  children,
  params,
  modal,
}: {
  children: React.ReactNode;
  params: { id: string };
  modal: React.ReactNode;
}) {
  const [contest, submissions] = await Promise.all([
    getContestById(params.id),
    fetchSubmissions(params.id),
  ]);

  const fallback = {
    [`submissions/${params.id}`]: submissions,
  };

  console.log(JSON.stringify(contest, null, 2));
  const { deadlines, metadata, tweetId, space } = contest;
  return (
    <div className="w-full flex flex-col items-center p-4">
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
              {modal}
            </VoteActionProvider>
          </ContestInteractionProvider>
        </SwrProvider>
      </ContestStateProvider>
    </div>
  );
}
