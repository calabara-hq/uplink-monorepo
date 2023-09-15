"use client";
import { useState } from "react";
import { useContestState } from "@/providers/ContestStateProvider";
import Link from "next/link";
import { Decimal } from "decimal.js";
import { mutate } from "swr";
import {
  HiXCircle,
  HiSparkles,
  HiPlusCircle,
  HiInformationCircle,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/ConnectButton";
import Modal from "../Modal/Modal";
import { BiInfoCircle, BiTime } from "react-icons/bi";
import useTweetQueueStatus from "@/hooks/useTweetQueueStatus";
import CreateContestTweet from "../ContestForm/CreateContestTweet";
import { OutputData } from "@editorjs/editorjs";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import SidebarVote from "./Vote";
import { toast } from "react-hot-toast";
import { IoWarningOutline } from "react-icons/io5";
import {
  SubmitterRewardsSection,
  VoterRewardsSection,
  SubmitterRestrictionsSection,
  VotingPolicySection,
} from "./SidebarInfo";
// sidebar for the main contest view

const InfoWrapper = ({
  bannerText,
  icon,
  children,
}: {
  bannerText: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col justify-center items-center bg-base-100 rounded-lg w-full p-4">
      {icon}
      <p className="text-center text-t1 text-lg font-semibold">{bannerText}</p>
      {children}
    </div>
  );
};

const TweetQueuedDialog = () => {
  return (
    <InfoWrapper
      bannerText="Tweet Queued"
      icon={<HiInformationCircle className="w-6 h-6 text-primary" />}
    >
      <div className="flex flex-col items-center justify-evenly gap-2 w-full">
        <p className="font-[500] text-t2">{`The announcement tweet is queued. It will be tweeted within 5 minutes of the contest start time.`}</p>
      </div>
    </InfoWrapper>
  );
};

const TweetNotQueuedDialog = ({
  startTime,
  prompt,
  contestId,
  spaceName,
  spaceId,
}: {
  startTime: string;
  prompt: {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
  };
  contestId: string;
  spaceName: string;
  spaceId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSuccess = () => {
    toast.success("Successfully scheduled your tweet");
    mutate(`/api/tweetQueueStatus/${contestId}`);
  };

  const customDecorators: {
    type: "text";
    data: string;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: "text",
      data: `\nbegins ${new Date(startTime).toLocaleString("en-US", {
        hour12: false,
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })} UTC`,
      title: "start time",
      icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
    },
    {
      type: "text",
      data: `\n${prompt.title}`,
      title: "prompt title",
      icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
    },
    {
      type: "text",
      data: `\nhttps://uplink.wtf/${spaceName}/contest/${contestId}`,
      title: "contest url",
      icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
    },
  ];

  return (
    <InfoWrapper
      bannerText="Tweet Required"
      icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
    >
      <div className="flex flex-col items-center justify-evenly gap-2 w-full text-t2">
        <p className="text-center ">{`This contest requires an announcement tweet before it can begin.`}</p>
        <button
          className="btn btn-primary btn-outline normal-case ml-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Tweet
        </button>
      </div>
      <CreateContestTweet
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        contestId={contestId}
        spaceId={spaceId}
        customDecorators={customDecorators}
        onSuccess={handleSuccess}
        onError={() => {}}
      />
    </InfoWrapper>
  );
};

const AdminsRequired = ({
  contestId,
  startTime,
  prompt,
  spaceName,
  spaceId,
}: {
  startTime: string;
  prompt: {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
  };
  contestId: string;
  spaceName: string;
  spaceId: string;
}) => {
  const { data: session, status } = useSession();
  const { contestAdmins } = useContestState();
  const { isTweetQueued, isLoading: isQueueStatusLoading } =
    useTweetQueueStatus(contestId);
  const isAdmin = contestAdmins.includes(session?.user?.address ?? "");

  if (status === "loading") return <SidebarSkeleton />;
  else if (isAdmin) {
    if (isQueueStatusLoading) return <SidebarSkeleton />;
    else if (isTweetQueued) return <TweetQueuedDialog />;
    else
      return (
        <TweetNotQueuedDialog
          {...{ contestId, startTime, prompt, spaceName, spaceId }}
        />
      );
  } else
    return (
      <InfoWrapper
        bannerText="Admins Required"
        icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
      >
        <div className="flex flex-col items-center justify-evenly gap-2 w-full text-t2">
          <p className="text-center ">{`Hang tight! A space admin is needed to launch the contest.`}</p>
          {!session?.user?.address && (
            <div className="flex flex-row items-center justify-start gap-2  xl:ml-auto text-t1">
              <p className="text-t1 text-sm">Are you an admin?</p>
              <WalletConnectButton style="btn-sm btn-ghost" />
            </div>
          )}
        </div>
      </InfoWrapper>
    );
};

const Pending = () => {
  return (
    <InfoWrapper
      bannerText="Pending"
      icon={<BiTime className="w-16 h-16 text-purple-500" />}
    >
      <p className="text-t2 text-center">
        {`This contest hasn't started yet. Check back soon!`}
      </p>
    </InfoWrapper>
  );
};

const Closed = () => {
  const { downloadGnosisResults, downloadUtopiaResults } =
    useContestInteractionState();
  const [downloadClicked, setDownloadClicked] = useState(false);
  return (
    <InfoWrapper
      bannerText="Contest Closed"
      icon={<HiOutlineLockClosed className="w-6 h-6 text-orange-500" />}
    >
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        {!downloadClicked && (
          <button
            className="btn btn-primary normal-case"
            onClick={() => setDownloadClicked(true)}
          >
            Download Winners
          </button>
        )}
        {downloadClicked && (
          <div className="flex gap-2 items-center">
            <button
              className="btn bg-[#12ff80] normal-case text-black border-none hover:bg-[#12ff8099]"
              onClick={downloadGnosisResults}
            >
              Gnosis
            </button>
            <button
              className="btn bg-[#4c7064] normal-case text-white border-none hover:bg-[#4c706499]"
              onClick={downloadUtopiaResults}
            >
              Utopia
            </button>
            <button
              className="btn btn-ghost btn-sm text-t2"
              onClick={() => setDownloadClicked(false)}
            >
              <HiXCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </InfoWrapper>
  );
};

const Submitting = ({ studioLink }: { studioLink: string }) => {
  const { stateRemainingTime } = useContestState();

  return (
    <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
      <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
        <Link
          href={studioLink}
          className="btn btn-accent normal-case flex flex-1"
          draggable={false}
        >
          Submit
        </Link>
        <p className="mx-2 p-2 text-center text-t2">{stateRemainingTime}</p>
      </div>
    </div>
  );
};

const SidebarSkeleton = () => {
  return (
    <div className="flex flex-col justify-between bg-base-100  rounded-lg w-full">
      <div className="space-y-2 p-4">
        <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
        <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
        <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
      </div>
    </div>
  );
};

export const RenderDetails = ({
  submitterRewards,
  voterRewards,
  submitterRestrictions,
  votingPolicy,
}: {
  submitterRewards: any;
  voterRewards: any;
  submitterRestrictions: any;
  votingPolicy: any;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <SubmitterRestrictionsSection
        submitterRestrictions={submitterRestrictions}
      />
      <SubmitterRewardsSection submitterRewards={submitterRewards} />
      <VoterRewardsSection voterRewards={voterRewards} />
      <VotingPolicySection votingPolicy={votingPolicy} />
    </div>
  );
};

const RenderStateSpecificDialog = ({
  contestId,
  spaceId,
  spaceName,
  startTime,
  prompt,
}: {
  contestId: string;
  spaceId: string;
  spaceName: string;
  startTime: string;
  prompt: any;
}) => {
  const { contestState, stateRemainingTime, type, tweetId } = useContestState();
  if (!contestState) return <SidebarSkeleton />;
  else if (contestState === "pending") {
    if (type === "twitter" && !tweetId) {
      return (
        <AdminsRequired
          {...{ contestId, spaceId, spaceName, startTime, prompt }}
        />
      );
    } else {
      return <Pending />;
    }
  } else if (contestState === "submitting") {
    return (
      <Submitting studioLink={`/${spaceName}/contest/${contestId}/studio`} />
    );
  } else if (contestState === "voting") {
    return <p>voting!!</p>;
  } else if (contestState === "closed") {
    return <Closed />;
  }
};

const ContestSidebar = ({
  spaceName,
  contestId,
  spaceId,
  startTime,
  prompt,
  submitterRewards,
  voterRewards,
  votingPolicy,
  submitterRestrictions,
}: {
  spaceName: string;
  contestId: string;
  spaceId: string;
  startTime: string;
  prompt: {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
  };
  submitterRewards: any;
  voterRewards: any;
  votingPolicy: any;
  submitterRestrictions: any;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <RenderDetails
        {...{
          submitterRewards,
          voterRewards,
          submitterRestrictions,
          votingPolicy,
        }}
      />
      <RenderStateSpecificDialog
        {...{ contestId, spaceId, spaceName, startTime, prompt }}
      />
    </div>
  );
};
export default ContestSidebar;
