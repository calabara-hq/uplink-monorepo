"use client";
import { useContestState } from "@/providers/ContestStateProvider";
import StandardSubmit from "./standardSubmit";
import TwitterSubmit from "./twitterSubmit";

export default function Page({
  params,
}: {
  params: { name: string; id: string };
}) {
  const { type } = useContestState();

  // contest in submit window
  if (type === "standard") return <StandardSubmit params={params} />;
  else if (type === "twitter") return <TwitterSubmit params={params} />;
  else return null;
}
