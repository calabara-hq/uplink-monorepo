import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import SubmissionModal from "./submissionModal";
import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission";
import fetchPopularSubmissions from "@/lib/fetch/fetchPopularSubmissions";

export default async function SubmissionPage({
  params: { submissionId },
}: {
  params: { submissionId: string };
}) {
  const submissions = await fetchPopularSubmissions();
  const submission = submissions.find(
    (submission) => submission.id === submissionId
  );

  return (
    <SubmissionModal>
      <div className="flex w-full gap-1 lg:gap-4 p-0">
        <div className="flex flex-col jusitfy-start w-full h-full ">
          <ExpandedSubmission submission={submission} />
        </div>
      </div>
    </SubmissionModal>
  );
}
