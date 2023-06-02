import Contests, { SubmissionDisplay } from "@/ui/Contests/Contests";
import Prompt from "@/ui/Contests/ContestPrompt";

import { getContestById } from "@/lib/fetch/contest";

export default async function Page({ params }: { params: { id: string } }) {
  const contest = await getContestById(parseInt(params.id));
  const { contestId, metadata, deadlines, promptUrl } = contest.data.contest;

  return (
    <>
      {/*@ts-expect-error*/}
      <Prompt
        contestId={contestId}
        metadata={metadata}
        deadlines={deadlines}
        promptUrl={promptUrl}
      />
    </>
  );
}
