import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import SubmissionModal, { ModalAddToCart } from "./submissionModal";
import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission";

export default async function SubmissionPage({
  params: { name, id, submissionId },
}: {
  params: { name: string; id: string; submissionId: string };
}) {
  const submission = await fetchSingleSubmission(submissionId);

  return (
    <SubmissionModal>
      <div className="flex w-full gap-1 lg:gap-4 p-0">
        <div className="flex flex-col jusitfy-start w-full h-full ">
          <ExpandedSubmission
            submission={submission}
            headerChildren={
              <div className="flex p-1 ml-auto items-center justify-center">
                <ModalAddToCart submission={submission} />
              </div>
            }
          />
        </div>
      </div>
    </SubmissionModal>
  );
}
