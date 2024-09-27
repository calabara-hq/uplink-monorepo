import fetchContest from "@/lib/fetch/fetchContest";
import { ContestStateProvider } from "@/providers/ContestStateProvider"
import { Metadata } from "next";


export async function generateMetadata({
    params,
  }: {
    params: { id: string };
  }): Promise<Metadata> {
    const contest = await fetchContest(params.id);

    return {
      title: `${contest.space.displayName}`,
      description: `${contest.space.displayName} on Uplink`,
      openGraph: {
        title: `${contest.space.displayName}`,
        description: `Create with ${contest.space.displayName} on Uplink`,
        images: [
          {
            url: `api/contest/${params.id}/contest_metadata`,
            width: 600,
            height: 600,
            alt: `${contest.space.displayName} logo`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  }


export default async function Layout({ params, children }: { params: { id: string }, children: React.ReactNode }) {
    const contest = await fetchContest(params.id);
    return (
        <ContestStateProvider contest={contest}>
            <div className="relative w-full flex flex-col items-center p-4">
                {children}
            </div>
        </ContestStateProvider>
    )
}