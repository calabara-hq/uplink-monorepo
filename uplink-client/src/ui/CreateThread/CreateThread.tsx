"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/providers/SessionProvider";
import Image from "next/image";
import { ThreadItem, useThreadCreator } from "@/hooks/useThreadCreator";
import { HiOutlineTrash, HiPhoto, HiXMark } from "react-icons/hi2";
import TwitterConnectButton from "../TwitterConnectButton/TwitterConnectButton";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { BiPlusCircle, BiSolidCircle } from "react-icons/bi";

const isStringBlank = (str: string) => {
  return !str.trim();
};

const TweetModal = ({
  isModalOpen,
  children,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
}) => {
  if (isModalOpen) {
    return (
      <div className="modal modal-open bg-[#00000080] transition-colors duration-300 ease-in-out">
        <div className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-2xl animate-springUp">
          {children}
        </div>
      </div>
    );
  }
  return null;
};

const RenderAccount = ({ isBarVisible }: { isBarVisible: boolean }) => {
  const { data: session, status } = useSession();
  if (session?.user?.twitter) {
    return (
      <div className="flex flex-col items-center">
        <Image
          src={session.user.twitter.profile_image_url_large}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
        {isBarVisible && <div className="bg-border w-1 h-full" />}
      </div>
    );
  }
  return null;
};

const RenderMedia = ({
  threadItem,
  isFocused,
  removeTweetMedia,
}: {
  threadItem: ThreadItem;
  isFocused: boolean;
  removeTweetMedia: any;
}) => {
  if (threadItem.isVideo) {
    return (
      <div className="relative w-full">
        {isFocused && (
          <button
            className="absolute top-[-10px] right-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg"
            onClick={() => removeTweetMedia(threadItem.id)}
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        )}
        <MediaController className="rounded-xl">
          <video
            slot="media"
            src={threadItem.primaryAssetBlob}
            poster={
              threadItem.videoThumbnailBlobIndex !== null
                ? threadItem.videoThumbnailOptions[
                    threadItem.videoThumbnailBlobIndex
                  ]
                : ""
            }
            preload="auto"
            muted
            crossOrigin=""
            className="rounded-t-xl h-64 w-full object-contain"
          />
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaTimeRange></MediaTimeRange>
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaMuteButton></MediaMuteButton>
          </MediaControlBar>
        </MediaController>
      </div>
    );
  } else if (threadItem.primaryAssetBlob) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          {isFocused && (
            <button
              className="absolute top-0 right-0 mt-[-10px] mr-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg"
              onClick={() => removeTweetMedia(threadItem.id)}
            >
              <HiOutlineTrash className="w-5 h-5" />
            </button>
          )}
          <Image
            src={threadItem.primaryAssetBlob}
            alt="Tweet Media"
            width={200}
            height={200}
            className="rounded-lg object-contain"
          />
        </div>
      </div>
    );
  } else return null;
};

const Tweet = ({
  threadItem,
  setTweetText,
  removeTweetMedia,
  isFocused,
}: {
  threadItem: ThreadItem;
  setTweetText: any;
  removeTweetMedia: any;
  isFocused: boolean;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea({ textAreaRef, value: threadItem.text });
  return (
    <div className="flex flex-col w-11/12 m-auto ">
      <textarea
        ref={textAreaRef}
        placeholder="whats happening?"
        //focused={focusedTweet === id}
        value={threadItem.text}
        rows={1}
        onChange={(e) => setTweetText(threadItem.id, e.target.value)}
        className="rounded-sm p-2.5 w-full outline-none resize-none leading-normal bg-transparent"
      />
      <RenderMedia
        threadItem={threadItem}
        isFocused={isFocused}
        removeTweetMedia={removeTweetMedia}
      />
    </div>
  );
};

const TweetFooter = ({
  tweet,
  setTweetVideoThumbnailBlobIndex,
  addTweet,
  handleFileChange,
  visible,
  handleSave,
  confirmLabel,
  isSaveDisabled,
  isMediaUploading,
}: {
  tweet: ThreadItem;
  setTweetVideoThumbnailBlobIndex: (id: string, index: number | null) => void;
  addTweet: () => void;
  handleFileChange: (data: any) => void;
  visible: boolean;
  handleSave: () => void;
  confirmLabel: string;
  isSaveDisabled: boolean;
  isMediaUploading: boolean;
}) => {
  const imageUploader = useRef<HTMLInputElement>(null);
  const thumbnailUploader = useRef<HTMLInputElement>(null);

  const Input = ({
    id,
    isVideo,
    mode,
    disabled,
    children,
  }: {
    id: string;
    isVideo: boolean;
    mode: "primary" | "thumbnail";
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <input
        placeholder="asset"
        type="file"
        disabled={disabled}
        accept={mode === "primary" ? "image/*, video/mp4" : "image/*"}
        className="hidden"
        onChange={(event) => {
          console.log(imageUploader);
          handleFileChange({ id, event, isVideo, mode });
        }}
        ref={mode === "primary" ? imageUploader : thumbnailUploader}
      />
      <div className={`${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        {children}
      </div>
    </div>
  );

  if (visible)
    return (
      <div className="flex flex-col gap-5">
        <span className="loading loading-spinner text-primary"></span>

        {tweet.isVideo && tweet?.videoThumbnailOptions?.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center bg-base-100 border border-border p-2 w-fit m-auto rounded">
            <p className="self-center text-xs">Thumbnail</p>
            <div className="grid grid-rows-2 sm:grid-rows-1 grid-cols-3 sm:grid-cols-5 gap-4 ">
              {tweet.videoThumbnailOptions.map((thumbOp, thumbIdx) => {
                return (
                  <div
                    key={thumbIdx}
                    className="relative cursor-pointer"
                    onClick={() =>
                      setTweetVideoThumbnailBlobIndex(tweet.id, thumbIdx)
                    }
                  >
                    <Image
                      src={thumbOp}
                      alt="Tweet Media"
                      width={64}
                      height={64}
                      className={`hover:opacity-50 rounded aspect-video object-contain ${
                        tweet.videoThumbnailBlobIndex === thumbIdx
                          ? "opacity-50"
                          : ""
                      }`}
                    />

                    {tweet.videoThumbnailBlobIndex === thumbIdx && (
                      <BiSolidCircle className="absolute text-primary w-5 h-5 top-[-10px] right-[-10px]" />
                    )}
                  </div>
                );
              })}
              <Input id={tweet.id} isVideo={false} mode="thumbnail">
                <div
                  className="w-16 h-9"
                  onClick={() => thumbnailUploader.current?.click()}
                >
                  <div className="w-full h-full bg-base-100 border border-border rounded opacity-50 hover:opacity-90 flex flex-col p-2 items-center justify-center cursor-pointer text-gray-500">
                    <BiPlusCircle className="w-4 h-4" />
                  </div>
                </div>
              </Input>
            </div>
          </div>
        )}
        <div className="w-full h-0.5 bg-border"></div>
        <div className="flex items-center justify-start w-full ml-auto">
          <Input
            id={tweet.id}
            isVideo={tweet.isVideo}
            mode="primary"
            disabled={tweet.primaryAssetBlob ? true : false}
          >
            <div
              className="hover:opacity-50 cursor-pointer"
              onClick={() => imageUploader.current?.click()}
            >
              <HiPhoto className="w-7 h-7" />
            </div>
          </Input>
          <div className="flex flex-row gap-2 ml-auto items-center justify-center">
            {tweet.text.length > 220 && tweet.text.length <= 280 && (
              <>
                <p className="text-xs text-warning">
                  {280 - tweet.text.length}
                </p>
                <div className="w-0.5 h-5 bg-border" />
              </>
            )}
            {tweet.text.length > 280 && (
              <>
                <p className="text-sm text-error">{280 - tweet.text.length}</p>
                <div className="w-0.5 h-5 bg-border" />
              </>
            )}

            <div className="hover:opacity-50 cursor-pointer" onClick={addTweet}>
              <BiPlusCircle className="w-7 h-7" />
            </div>
            <button
              onClick={handleSave}
              className="btn btn-sm btn-primary lowercase"
              disabled={isSaveDisabled || isMediaUploading}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
        {isMediaUploading && (
          <div className="flex flex-row w-full items-center justify-end gap-2 text-gray-500">
            <p className="text-xs">uploading media</p>
            <div
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        )}
      </div>
    );
};

const CreateThread = ({
  isModalOpen,
  setIsModalOpen,
  initialThread,
  confirmLabel,
  onConfirm,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  initialThread: ThreadItem[];
  confirmLabel: string;
  onConfirm: (thread: ThreadItem[]) => void;
}) => {
  const {
    thread,
    addTweet,
    removeTweet,
    removeTweetMedia,
    setTweetText,
    setTweetVideoThumbnailBlobIndex,
    handleFileChange,
    validateThread,
  } = useThreadCreator(initialThread);
  const [focusedTweet, setFocusedTweet] = useState(initialThread[0]?.id);
  const [title, setTitle] = useState("");

  const { data: session, status } = useSession();
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  useEffect(() => {
    setFocusedTweet(thread.at(-1)?.id);
  }, [thread.length]);

  useEffect(() => {
    thread.map((tweet) => {
      const isBlank = isStringBlank(tweet.text);
      if (isBlank && !tweet.primaryAssetBlob) {
        setIsSaveDisabled(true);
        return;
      } else if (!isBlank) {
        if (tweet.text.length > 280) {
          setIsSaveDisabled(true);
          return;
        }
      }
      setIsSaveDisabled(false);
    });
  }, [thread]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    const { isError } = await validateThread();
    if (isError) return;
    onConfirm(thread);
    handleClose();
  };

  return (
    <TweetModal isModalOpen={isModalOpen}>
      <button
        className="absolute top-2 left-2 bg-base-100 rounded-full p-1 z-10 hover:opacity-50"
        onClick={handleClose}
      >
        <HiXMark className="w-5 h-5" />
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
              <div
                key={index}
                className={`grid grid-cols-[64px_auto] w-full ml-auto mr-auto overflow-hidden relative ${
                  focusedTweet !== tweet.id ? "opacity-50" : ""
                }`}
                onClick={() => setFocusedTweet(tweet.id)}
              >
                {focusedTweet === tweet.id && thread.length > 1 && (
                  <HiXMark
                    className="absolute top-0 right-0 w-6 h-6 ml-auto cursor-pointer hover:opacity-50"
                    onClick={() => {
                      removeTweet(tweet.id);
                      setFocusedTweet(thread.at(-1)?.id);
                    }}
                  />
                )}

                <RenderAccount
                  isBarVisible={thread.length > 0 && index < thread.length - 1}
                />
                <div className="w-11/12 flex flex-col gap-2">
                  <Tweet
                    threadItem={tweet}
                    setTweetText={setTweetText}
                    removeTweetMedia={removeTweetMedia}
                    isFocused={focusedTweet === tweet.id}
                  />
                  <TweetFooter
                    {...{
                      tweet,
                      setTweetVideoThumbnailBlobIndex,
                      addTweet,
                      handleFileChange,
                      visible: focusedTweet === tweet.id,
                      handleSave,
                      confirmLabel,
                      isSaveDisabled,
                      isMediaUploading: thread.some(
                        (tweet) => tweet.isUploading
                      ),
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </TweetModal>
  );
};

export default CreateThread;
