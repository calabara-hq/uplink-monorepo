import { ApiThreadItem, ThreadItem } from "@/hooks/useThreadCreator";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateThread from "../CreateThread/CreateThread";
import { HiOutlineInformationCircle, HiPlusCircle } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateContestTweetDocument } from "@/lib/graphql/contests.gql";
import { OutputData } from "@editorjs/editorjs";

const composeInferredThread = (prompt: {
  title: string;
  body: OutputData | null;
  coverUrl?: string;
}) => {
  const { title, coverUrl } = prompt;

  const thread: ThreadItem[] = [
    {
      id: nanoid(),
      text: title,
      primaryAssetUrl: coverUrl ?? null, //TODO: if mimetype is not svg, then use the coverUrl
      primaryAssetBlob: null,
      videoThumbnailUrl: null,
      videoThumbnailBlobIndex: null,
      videoThumbnailOptions: null,
      assetSize: null,
      assetType: null,
      isVideo: false,
      isUploading: false,
    },
  ];
  return thread;
};

const CreateContestTweet = ({
  isModalOpen,
  setIsModalOpen,
  startTime,
  prompt,
  contestId,
  spaceName,
  spaceId,
  onSuccess,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  startTime: string;
  prompt: { title: string; body: OutputData | null; coverUrl?: string };
  contestId: string;
  spaceName: string;
  spaceId: string;
  onSuccess: () => void;
}) => {
  const initialThread = composeInferredThread(prompt);
  const handleTweetMutation = useHandleMutation(CreateContestTweetDocument);

  const postTweet = async (thread: ThreadItem[]) => {
    const apiObject = {
      contestId,
      spaceId,
      tweetThread: thread.map((el) => {
        const serverThreadItem: ApiThreadItem = {
          text: el.text,
          ...(el.assetSize ? { assetSize: el.assetSize.toString() } : {}),
          ...(el.assetType ? { assetType: el.assetType } : {}),
        };
        if (el.isVideo) {
          serverThreadItem.previewAsset = el.videoThumbnailUrl;
          serverThreadItem.videoAsset = el.primaryAssetUrl;
        } else if (el.primaryAssetUrl) {
          serverThreadItem.previewAsset = el.primaryAssetUrl;
        }
        return serverThreadItem;
      }),
    };
    try {
      const res = await handleTweetMutation(apiObject);
      if (!res) {
        toast.error("There was an error. Please try again.");
        return {
          success: false,
          errors: "",
        };
      }
      const { errors, success } = res.data.createContestTweet;
      return { success, errors };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        errors: "",
      };
    }
  };

  const handleConfirm = async (thread: ThreadItem[]) => {
    const { success, errors } = await postTweet(thread);
    if (success) {
      toast.success("Tweet successfully scheduled!");
      onSuccess();
    }
  };

  return (
    <CreateThread
      initialThread={initialThread}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      confirmLabel="Save"
      onConfirm={handleConfirm}
      customDecorators={[
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
          data: `\nhttps://uplink.wtf/${spaceName}/contests/${contestId}`,
          title: "contest url",
          icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
        },
      ]}
    />
  );
};

export default CreateContestTweet;
