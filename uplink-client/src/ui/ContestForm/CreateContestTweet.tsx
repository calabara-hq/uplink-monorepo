"use client";
import useSWRMtation from "swr/mutation";
import CreateThread from "../CreateThread/CreateThread";
import { ApiThreadItem, ThreadItem } from "@/hooks/useThreadCreator";
import { useEffect, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";
import { nanoid } from "nanoid";
import { handleMutationError } from "@/lib/handleMutationError";
import { useSession } from "@/providers/SessionProvider";

async function postContestTweet(
  url,
  {
    arg,
  }: {
    arg: {
      contestId: string;
      spaceId: string;
      tweetThread: ApiThreadItem[];
      csrfToken: string | null;
    };
  }
) {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": arg.csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
      mutation CreateContestTweet($contestId: ID!, $spaceId: ID!, $tweetThread: [ThreadItemInput!]!){
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
    .then((res) => res.data.createContestTweet);
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
  const { data: session, status } = useSession();
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
    return () => {
      reset();
    };
  }, []);

  const handleConfirm = async (thread: ThreadItem[]) => {
    const payload = {
      contestId,
      spaceId,
      tweetThread: thread.map((el) => {
        const serverThreadItem: ApiThreadItem = {
          text: el.text,
          ...(el.assetSize ? { assetSize: el.assetSize } : {}),
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
      csrfToken: session?.csrfToken,
    };
    try {
      await trigger(payload).then(({ success, errors }) => {
        if (success) {
          setIsModalOpen(false);
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
        initialThread={[
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
        ]}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmLabel="Post"
        onConfirm={(thread: ThreadItem[]) => handleConfirm(thread)}
        customDecorators={customDecorators}
      />
    </>
  );
};

export default CreateContestTweet;
