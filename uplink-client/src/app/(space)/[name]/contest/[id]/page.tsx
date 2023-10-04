import SubmissionDisplay from "@/ui/Submission/SubmissionDisplay";
import ContestHeading from "@/ui/ContestHeading/ContestHeading";
import ContestDetails from "@/ui/ContestDetails/ContestDetails";
import SidebarVote from "@/ui/Vote/Vote";
import MobileContestActions from "@/ui/MobileContestActions/MobileContestActions";

// TODO: dynamic metadata

export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const contestId = params.id;
  const spaceName = params.name;


  return (
    <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
      <div className="flex w-full gap-6 ">
        <div className="hidden xl:block w-1/4 max-w-[300px] h-fit flex-shrink-0 border border-border rounded-lg">
          {/*@ts-expect-error*/}
          <ContestDetails contestId={contestId} />
        </div>
        <div className="w-[60%] flex-grow ">
          <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
            <ContestHeading contestId={contestId} />
            <MobileContestActions
              contestId={contestId}
              spaceName={spaceName}
              detailChildren={
                // @ts-expect-error
                <ContestDetails contestId={contestId} />
              }
            />

            <SubmissionDisplay contestId={contestId} spaceName={spaceName} />
          </div>
        </div>
      </div>
      <SidebarVote contestId={contestId} />
    </div>
  );
}
