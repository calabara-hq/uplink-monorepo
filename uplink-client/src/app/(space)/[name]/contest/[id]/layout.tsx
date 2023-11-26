import { ContestStateProvider } from "@/providers/ContestStateProvider";
import fetchContest from "@/lib/fetch/fetchContest";
import { ContestInteractionProvider } from "@/providers/ContestInteractionProvider";
import { VoteActionProvider } from "@/providers/VoteActionProvider";
import { redirect } from "next/navigation";

export default async function Layout({
  params,
  children,
}: {
  params: { id: string; name: string };
  children: React.ReactNode;
}) {
  const contestId = params.id;
  const contestPromise = fetchContest(contestId);

  // redirect the user without suspending rendering

  const contestData = await contestPromise;
  if (params.name !== contestData.space.name) {
    redirect(`/${contestData.space.name}/contest/${params.id}`)
  }


  return (
    <div className="w-full flex flex-col items-center p-4">
      <ContestStateProvider contestPromise={contestPromise}>
        <ContestInteractionProvider contestId={contestId}>
          <VoteActionProvider contestId={contestId}>
            {children}
          </VoteActionProvider>
        </ContestInteractionProvider>
      </ContestStateProvider>
    </div>
  );
}
