import fetchContest from "@/lib/fetch/fetchContest";
import LoadingDialog from "./loadingDialog";
import dynamic from "next/dynamic";

const StandardSubmit = dynamic(() => import("./standardSubmit"), {
  ssr: false,
  loading: () => <LoadingDialog springUp />,
});

const TwitterSubmit = dynamic(() => import("./twitterSubmit"), {
  ssr: false,
  loading: () => <LoadingDialog springUp />,
});

export default async function Page({
  params,
}: {
  params: { name: string; id: string };
}) {
  const constest = await fetchContest(params.id);
  const { metadata } = constest;

  // contest in submit window
  if (metadata.type === "standard") return <StandardSubmit params={params} />;
  else if (metadata.type === "twitter")
    return <TwitterSubmit params={params} />;
  else return null;
}
