import fetchLegacyContest from "@/lib/fetch/fetchLegacyContest";
import { LegacyContestWithPrompt } from "@/types/contest";
import { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const contest: LegacyContestWithPrompt = await fetchLegacyContest(params.id).then(async data => {
    const promptData = await fetch(data.promptUrl).then(res => res.json());
    return { ...data, promptData };
  });

  return {
    title: `${contest.promptData.title} on Uplink`,
    description: `${contest.promptData.title} on Uplink`,
    openGraph: {
      title: `${contest.promptData.title}`,
      description: `${contest.promptData.title} on Uplink`,
      images: [
        {
          url: `api/contest/${params.id}/contest_metadata`,
          width: 600,
          height: 600,
          alt: `contest logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full flex flex-col items-center p-4">
      {children}
    </div>
  )
}