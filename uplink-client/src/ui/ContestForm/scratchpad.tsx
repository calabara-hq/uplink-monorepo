"use client";
import useSWRMtation from "swr/mutation";
import CreateThread from "../CreateThread/CreateThread";
import { ApiThreadItem, ThreadItem } from "@/hooks/useThreadCreator";
import { useEffect, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";
import { nanoid } from "nanoid";
import { handleMutationError } from "@/lib/handleMutationError";

async function postContestTweet(
  url,
  {
    arg,
  }: {
    arg: {
      contestId: string;
      spaceId: string;
      tweetThread: ApiThreadItem[];
    };
  }
) {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
      mutation CreateContestTweet($contestId: ID!, $spaceId: ID!, $tweetThread: [ThreadItem!]!){
        createContestTweet(contestId: $contestId, spaceId: $spaceId, tweetThread: $tweetThread){
            success
        }
    }`,
      variables: {
        contestId: arg.contestId,
        spaceId: arg.spaceId,
        tweetThread: arg.tweetThread,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.createTwitterSubmission);
}

const CreateContestTweet = ({
  contestId,
  spaceId,
  onError,
  onSuccess,
  isModalOpen,
  setIsModalOpen,
  customDecorators,
}: {
  contestId: string;
  spaceId: string;
  onError: () => void;
  onSuccess: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  customDecorators?: {
    type: "text";
    data: string;
    title: string;
    icon: React.ReactNode;
  }[];
}) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [thread, setThread] = useState<ThreadItem[]>([
    {
      id: nanoid(),
      text: "",
      primaryAssetUrl: null,
      primaryAssetBlob: null,
      videoThumbnailUrl: null,
      videoThumbnailBlobIndex: null,
      videoThumbnailOptions: null,
      assetSize: null,
      assetType: null,
      isVideo: false,
      isUploading: false,
    },
  ]);
  const { trigger, data, error, isMutating, reset } = useSWRMtation(
    `/api/createContestTweet/${contestId}`,
    postContestTweet,
    {
      onError: (err) => {
        console.log(err);
        onError();
        reset();
      },
    }
  );

  useEffect(() => {
    return reset();
  }, []);

  const handleConfirm = async (thread: ThreadItem[]) => {
    const payload = {
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
      await trigger(payload).then(({ success, errors }) => {
        if (success) {
          onSuccess();
          reset();
        } else {
          onError();
          reset();
        }
      });
    } catch (err) {
      onError();
      reset();
    }
  };

  return (
    <>
      <CreateThread
        initialThread={[]}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmLabel="Confirm"
        onConfirm={() => {
          setThread(thread);
          setIsPreviewModalOpen(true);
        }}
        customDecorators={customDecorators}
      />
      <Modal
        isModalOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      >
        <p>hey there</p>
        <ModalActions
          confirmLabel="Post"
          onConfirm={() => handleConfirm(thread)}
          cancelLabel="Cancel"
          onCancel={() => {
            setIsModalOpen(true);
            setIsPreviewModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default CreateContestTweet;
