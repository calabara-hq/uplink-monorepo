import fetchContest from "@/lib/fetch/fetchContest";
import { ContestStateProvider } from "@/providers/ContestStateProvider"

export default async function Layout({ params, children, submission }: { params: { id: string }, children: React.ReactNode, submission: React.ReactNode }) {
    const contest = await fetchContest(params.id);
    return (
        <ContestStateProvider contest={contest}>
            <div className="relative w-full flex flex-col items-center p-4">
                {children}
                {submission}

            </div>
        </ContestStateProvider>
    )
}