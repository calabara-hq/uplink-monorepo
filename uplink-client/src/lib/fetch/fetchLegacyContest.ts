import { LegacyContest } from "@/types/contest";
import handleNotFound from "../handleNotFound";
import { BaseSubmission, Submission } from "@/types/submission";

const fetchLegacyContest = async (contestId: string): Promise<LegacyContest> => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/legacy_singleContest?id=${contestId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": process.env.API_SECRET!,
    },
    next: { tags: [`contest/${contestId}`] },
  })
    .then((res) => res.json())
    .then(handleNotFound)
    .then(async data => {
      return {
        ...data,
        submissions: await Promise.all(
          data.submissions.map(async (submission: BaseSubmission) => {
            const data: Submission = await fetch(submission.url).then((res) => res.json());
            return { ...submission, data: data };
          })
        )
      }
    })
  return data;
}

export default fetchLegacyContest;