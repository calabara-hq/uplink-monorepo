"use client";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { useSession } from "@/providers/SessionProvider";
import Image from "next/image";
import { ThreadItem, useThreadCreator } from "@/hooks/useThreadCreator";
import { PhotoIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import TwitterConnectButton from "../TwitterConnectButton/TwitterConnectButton";

const CreateThread = ({
  initialThread,
  confirmLabel,
  onConfirm,
}: {
  initialThread: ThreadItem[] | [];
  confirmLabel: string;
  onConfirm: (thread: ThreadItem[]) => void;
}) => {
  const [modalIsOpen, setModalisOpen] = useState(false);
  const {
    thread,
    addTweet,
    removeTweet,
    setTweetText,
    setTweetMediaUrl,
    setTweetMediaBlob,
    resetThread,
  } = useThreadCreator(initialThread);

  const { data: session, status } = useSession();

  const handleClose = () => {
    setModalisOpen(false);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setModalisOpen(true)}>
        Add Tweet
      </button>
      <Modal
        isModalOpen={modalIsOpen}
        onClose={handleClose}
        disableClickOutside={true}
      >
        <button
          className="absolute top-2 right-2 btn btn-sm bg-base-100 border-none rounded-full"
          onClick={handleClose}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        <div className="flex flex-col w-full px-1 gap-4 mt-8">
          {!session?.user?.twitter && (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <h1>Please link your twitter account to get started</h1>
              <TwitterConnectButton />
            </div>
          )}
          {session?.user?.twitter &&
            thread.map((tweet, index) => {
              return (
                <div key={index}>
                  <Tweet
                    threadItem={tweet}
                    //focusedTweet={focusedTweet}
                    //setFocusedTweet={setFocusedTweet}
                    setTweetText={setTweetText}
                  />
                  <div
                    className={`flex items-center justify-start w-12/12 ml-auto ${
                      // focusedTweet === tweet.id ? "visible" : "hidden"
                      "visible"
                    }`}
                  >
                    <button className="btn btn-sm btn-ghost">
                      <PhotoIcon className="w-8 h-8" />
                    </button>
                    <button
                      className="btn btn-sm btn-ghost ml-auto"
                      onClick={() => addTweet()}
                    >
                      <PlusIcon className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => {
                        onConfirm(thread);
                        handleClose();
                      }}
                      className="btn btn-sm btn-primary"
                      disabled={false} // TODO: disable if some tweets are empty
                    >
                      {confirmLabel}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </Modal>
    </>
  );
};

const Tweet = ({
  threadItem,
  //focusedTweet,
  // setFocusedTweet,
  setTweetText,
}: {
  threadItem: ThreadItem;
  // focusedTweet: string;
  // setFocusedTweet: any;
  setTweetText: any;
}) => {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div
      className="grid grid-cols-[64px_auto] bg-black w-full ml-auto mr-auto overflow-hidden relative"
      // onClick={() => setFocusedTweet(threadItem.id)}
    >
      <RenderAccount />
      <div className="flex flex-col w-full bg-green-300">
        <textarea
          //ref={textAreaRef}
          placeholder="whats happening?"
          //focused={focusedTweet === id}
          value={threadItem.text}
          onChange={(e) => setTweetText(threadItem.id, e.target.value)}
          className={`rounded-sm p-2.5 w-9/10 outline-none ${
            "cursor-text"
            //    focusedTweet === threadItem.id
            //      ? " cursor-text"
            //      : "bg-gray-900 cursor-pointer"
          }`}
        />
        <RenderMedia threadItem={threadItem} />
      </div>
    </div>
  );
};

const RenderAccount = () => {
  const { data: session, status } = useSession();
  if (session?.user?.twitter) {
    return (
      <div className="flex flex-col items-center">
        <Image
          src={session.user.twitter.profile_image_url}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
        {/*<div className={`bg-[#a3a3a3] w-3 h-10 hidden`}></div>*/}
      </div>
    );
  }
  return null;
};

const RenderMedia = ({ threadItem }: { threadItem: ThreadItem }) => {
  if (threadItem.media) {
    return (
      <div className="flex flex-col items-center">
        <Image
          src={threadItem.media?.blob || threadItem.media?.url}
          alt="User Avatar"
          width={200}
          height={200}
          className="rounded-lg object-contain"
        />
        {/*<div className={`bg-[#a3a3a3] w-3 h-10 hidden`}></div>*/}
      </div>
    );
  }
  return null;
};

const TweetArea = () => {
  return null;
};

/**
 * const Tweet = ({
  threadItem,
  focusedTweet,
  setFocusedTweet,
}: {
  threadItem: ThreadItem;
  focusedTweet: number;
  setFocusedTweet: any;
}) => {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className="bg-black">
      {session?.user?.twitter?.profile_image_url && (
        <div className="flex flex-col gap-2">
          <Image
            className="rounded-full"
            width={50}
            height={50}
            src={session?.user?.twitter?.profile_image_url}
            alt="User Avatar"
          />
          <div className="flex flex-col flex-grow bg-red-300">
            <textarea
              rows={1}
              placeholder="What's happening?"
              className="mt-1 p-2 textarea textarea-lg resize-none overflow-y-hidden bg-base-100"
              style={{ height: "auto" }}
              value={threadItem.text}
              //onInput={handleTextareaResize}
            />
          </div>
        </div>
      )}
    </div>
  );
};
 */

export default CreateThread;
