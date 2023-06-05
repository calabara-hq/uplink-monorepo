import { ContestInteractionProvider } from "@/providers/ContestInteractionProvider";
import { getContestById } from "@/lib/fetch/contest";
import { ContestStateProvider } from "@/providers/ContestStateProvider";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string; id: string };
}) {
  const contest = await getContestById(parseInt(params.id));
  const { metadata, deadlines, promptUrl } = contest.data.contest;
  return (
    <div className="m-auto w-[80vw] flex flex-col items-center border-2 border-purple-500">
      <div className="flex justify-center gap-4 m-auto w-[80vw] lg:py-6">
        <ContestInteractionProvider>
          <ContestStateProvider deadlines={deadlines}>
            {children}
          </ContestStateProvider>
        </ContestInteractionProvider>
      </div>
    </div>
  );
}
