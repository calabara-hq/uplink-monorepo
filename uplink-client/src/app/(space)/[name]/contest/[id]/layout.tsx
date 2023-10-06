import { ContestStateProvider } from "@/providers/ContestStateProvider";
import fetchContest from "@/lib/fetch/fetchContest";
import { ContestInteractionProvider } from "@/providers/ContestInteractionProvider";
import { VoteActionProvider } from "@/providers/VoteActionProvider";

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
  const contestPromise = fetchContest(contestId);

  return (
    <div className="w-full flex flex-col items-center p-4">
      <ContestStateProvider contestPromise={contestPromise}>
        <ContestInteractionProvider contestId={contestId}>
          <VoteActionProvider contestId={contestId}>
            {children}
            {modal}
          </VoteActionProvider>
        </ContestInteractionProvider>
      </ContestStateProvider>
    </div>
  );
}
