"use client";
import useSubmitParams from "@/hooks/useSubmitParams";
import { ThreadItem, ApiThreadItem } from "@/hooks/useThreadCreator";
import { useContestState } from "@/providers/ContestStateProvider";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import CreateThread from "@/ui/CreateThread/CreateThread";
import Stack from "@/ui/Stack/Stack";
import TwitterConnectButton from "@/ui/TwitterConnectButton/TwitterConnectButton";
import { set } from "date-fns";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useEffect, useReducer, useState } from "react";
import { BiInfoCircle, BiLink } from "react-icons/bi";
import { HiCheckBadge, HiXCircle, HiXMark } from "react-icons/hi2";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";
import { ModalActions } from "@/ui/Modal/Modal";
import { formatAddress } from "@/utils/formatAddress";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateTwitterSubmissionDocument } from "@/lib/graphql/submit.gql";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const StepBox = ({ step }: { step: number }) => {
  return (
    <div className="flex w-12 h-12 rounded bg-base-200 items-center justify-center">
      <p>{step}</p>
    </div>
  );
};

const Step1 = ({ contestId }: { contestId: string }) => {
  const { data: session, status } = useSession();
  const { userSubmitParams, isLoading } = useSubmitParams(contestId);

  return (
    <div className="flex gap-2 justify-between">
      <div className="flex flex-row gap-2 items-center">
        <StepBox step={1} />
        <div className="flex flex-col">
          <p>Check your eligibility</p>
          <p>Verify that you meet the entrance requirements</p>
        </div>
      </div>
      <div className="w-56 h-56">
        <Stack
          layer1={
            <div className="flex flex-row justify-between text-xs font-bold items-center">
              <p>status</p>
              <div className="flex flex-row gap-2 items-center">
                {userSubmitParams ? (
                  userSubmitParams.remainingSubPower > 0 ? (
                    <>
                      <p className="ml-auto">eligible</p>
                      <HiCheckBadge className="text-success w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="ml-auto"> not eligible</p>
                      <HiXCircle className="w-5 h-5 text-gray-500" />
                    </>
                  )
                ) : (
                  <>
                    {(status === "authenticated" || status === "loading") &&
                      isLoading && <p>loading</p>}
                    {status === "unauthenticated" && <p>not connected</p>}
                  </>
                )}
              </div>
            </div>
          }
          layer2={
            <div className="flex flex-col gap-2">
              <p className="font-bold">Eligibility</p>
              <WalletConnectButton />
              {userSubmitParams && (
                <div className="flex flex-col text-xs">
                  {userSubmitParams.restrictionResults.map((el, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex flex-row gap-2 items-center m-1"
                      >
                        <p>
                          {el.restriction.tokenRestriction.threshold.toString()}{" "}
                          {el.restriction.tokenRestriction.token.symbol}
                        </p>
                        {el.result === true ? (
                          <HiCheckBadge className="text-success w-5 h-5 ml-auto" />
                        ) : (
                          <HiXCircle className="w-5 h-5 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

const Step2 = ({ contestId }: { contestId: string }) => {
  const { data: session, status } = useSession();
  const { userSubmitParams, isLoading } = useSubmitParams(contestId);

  const isDisabled =
    status !== "authenticated" ||
    !userSubmitParams ||
    userSubmitParams.remainingSubPower <= 0;

  const disabledClass = isDisabled ? "opacity-50 pointer-events-none" : "";

  return (
    <div
      className={`flex gap-2 justify-between transition duration-300 ${disabledClass}`}
    >
      <div className="flex flex-row gap-2 items-center">
        <StepBox step={2} />
        <div className="flex flex-col">
          <p>Link your Twitter</p>
        </div>
      </div>
      <div className="w-56 h-56">
        <Stack
          layer1={
            <div className="flex flex-row justify-between text-xs font-bold items-center">
              <p>status</p>
              <div className="flex flex-row gap-2 items-center">
                {session?.user?.twitter ? (
                  <>
                    <p className="ml-auto">connected</p>
                    <HiCheckBadge className="text-success w-5 h-5" />
                  </>
                ) : (
                  <>
                    <p className="ml-auto"> not connected</p>
                    <HiXCircle className="w-5 h-5 text-gray-500" />
                  </>
                )}
              </div>
            </div>
          }
          layer2={
            <div className="flex flex-col gap-2 h-full">
              <p className="font-bold">Twitter</p>
              {session?.user?.twitter ? (
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                  <Image
                    src={session?.user?.twitter?.profile_image_url_large}
                    alt="twitter profile image"
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                  <p className="font-bold">
                    @{session?.user?.twitter?.username}
                  </p>
                </div>
              ) : (
                <TwitterConnectButton />
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

const Step3 = ({
  contestId,
  spaceName,
}: {
  contestId: string;
  spaceName: string;
}) => {
  const { data: session, status } = useSession();
  const isReady = status === "authenticated" && session?.user?.twitter !== null;
  const { userSubmitParams, isLoading } = useSubmitParams(contestId);
  const [title, setTitle] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
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

  const isDisabled =
    status !== "authenticated" ||
    !session?.user?.twitter ||
    !userSubmitParams ||
    userSubmitParams.remainingSubPower <= 0;

  const disabledClass = isDisabled ? "opacity-50 pointer-events-none" : "";

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsPreviewModalOpen(false);
      setIsTweetModalOpen(false);
    }
  }, [status]);

  return (
    <>
      <div
        className={`flex gap-2 justify-between transition duration-300 ${disabledClass}`}
      >
        <div className="flex flex-row gap-2 items-center">
          <StepBox step={2} />
          <div className="flex flex-col">
            <p>Compose your submission!</p>
          </div>
        </div>
        <div className="w-56 h-56">
          <Stack
            layer1={
              <div className="flex flex-row justify-between text-xs font-bold items-center">
                <p>status</p>
                <div className="flex flex-row gap-2 items-center">
                  {session?.user?.twitter ? (
                    <>
                      <p className="ml-auto">connected</p>
                      <HiCheckBadge className="text-success w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="ml-auto"> not connected</p>
                      <HiXCircle className="w-5 h-5 text-gray-500" />
                    </>
                  )}
                </div>
              </div>
            }
            layer2={
              <div className="flex flex-col gap-2 h-full">
                <p className="font-bold">Create</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsTweetModalOpen(true)}
                >
                  Add Tweet
                </button>
              </div>
            }
          />
        </div>
      </div>
      <CreateThread
        isModalOpen={isTweetModalOpen}
        setIsModalOpen={setIsTweetModalOpen}
        initialThread={thread}
        confirmLabel="save thread"
        onConfirm={(thread) => {
          setThread(thread);
          setIsPreviewModalOpen(true);
        }}
      />
      <PreviewModal
        thread={thread}
        title={title}
        setTitle={setTitle}
        isModalOpen={isPreviewModalOpen}
        handleRevert={() => {
          setIsPreviewModalOpen(false);
          setIsTweetModalOpen(true);
        }}
        handleClose={() => setIsPreviewModalOpen(false)}
        contestId={contestId}
        spaceName={spaceName}
      />
    </>
  );
};

const PreviewModal = ({
  thread,
  title,
  setTitle,
  isModalOpen,
  handleClose,
  handleRevert,
  contestId,
  spaceName,
}: {
  thread: ThreadItem[];
  title: string;
  setTitle: (title: string) => void;
  isModalOpen: boolean;
  handleClose: () => void;
  handleRevert: () => void;
  contestId: string;
  spaceName: string;
}) => {
  const handleMutation = useHandleMutation(CreateTwitterSubmissionDocument);
  const router = useRouter();

  type TwitterSubmission = {
    title: string;
    thread: ApiThreadItem[];
  };


  const handleSubmit = async () => {
    const submission: TwitterSubmission = {
      title: title,
      thread: thread.map((el) => {
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
    await handleMutation({
      contestId,
      submission,
    })
      .then((res) => {
        if (!res) return;
        if (res.error) return; // known error handled by the mutation hook (didn't throw)
        const { success } = res.data?.createSubmission;
        if (!success) {
          return toast.error(
            "Oops, something went wrong. Please check your inputs and try again."
          );
        } else if (success) {
          toast.success("Submission created successfully", {
            icon: "🎉",
          });
          router.refresh();
          router.push(`${spaceName}/contests/${contestId}`);
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error("unknown error");
      });
  };

  if (isModalOpen) {
    return (
      <div className="modal modal-open bg-[#00000080] transition-colors duration-300 ease-in-out">
        <div className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-2xl animate-springUp">
          <button
            className="absolute top-2 left-2 bg-base-100 rounded-full p-1 z-10 hover:opacity-50"
            onClick={handleClose}
          >
            <HiXMark className="w-5 h-5" />
          </button>
          <div className="flex flex-col w-11/12 m-auto px-1 gap-4 mt-8">
            <h2 className="self-start font-bold text-lg">Site Preview</h2>
            <div className="w-10/12">
              <label className="label">
                <span className="flex flex-row items-center gap-2 label-text">
                  <p>Submission Title</p>
                  <div
                    className="tooltip tooltip-right"
                    data-tip="The submission title is used for site display only. It will not appear
                    as part of your tweet."
                  >
                    <BiInfoCircle className="w-4 h-4 cursor-pointer" />
                  </div>
                </span>
              </label>
              <div className="flex flex-row items-center gap-4">
                <input
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  maxLength={50}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="My awesome new submission"
                  className="input input-primary w-full"
                />
                {title.length > 20 && title.length <= 50 && (
                  <p className="text-xs text-warning">{50 - title.length}</p>
                )}
              </div>
            </div>
            <div className="w-7/12">
              <label className="label">
                <span className="flex flex-row items-center gap-2 label-text">
                  <p>Preview</p>
                  <div
                    className="tooltip tooltip-right"
                    data-tip="This is what users will see before they click to expand your full submission."
                  >
                    <BiInfoCircle className="w-4 h-4 cursor-pointer" />
                  </div>
                </span>
              </label>
              <RenderPreview thread={thread} title={title} />
            </div>
          </div>

          <ModalActions
            confirmLabel="submit"
            cancelLabel="edit tweet"
            confirmDisabled={!title}
            onConfirm={handleSubmit}
            onCancel={handleRevert}
          />
        </div>
      </div>
    );
  }
  return null;
};

const RenderPreview = ({
  thread,
  title,
}: {
  thread: ThreadItem[];
  title: string;
}) => {
  const { data: session, status } = useSession();

  const {
    isVideo,
    primaryAssetBlob,
    videoThumbnailOptions,
    videoThumbnailBlobIndex,
  } = thread[0];

  const submissionType = isVideo
    ? "video"
    : primaryAssetBlob
    ? "image"
    : "text";

  return (
    <div className="card card-compact cursor-pointer border border-border rounded-xl bg-base-100">
      {submissionType === "video" ? (
        <>
          <RenderVideoPreview
            video={primaryAssetBlob}
            thumbnail={videoThumbnailOptions[videoThumbnailBlobIndex]}
          />
          <SubmissionBody
            title={title}
            author={session?.user?.address}
            subType={submissionType}
          />
        </>
      ) : submissionType === "image" ? (
        <>
          <RenderImagePreview image={primaryAssetBlob} />
          <SubmissionBody
            title={title}
            author={session?.user?.address}
            subType={submissionType}
          />
        </>
      ) : (
        <RenderTextPreview
          text={thread[0].text}
          title={title}
          author={session?.user?.address}
        />
      )}
    </div>
  );
};

const SubmissionBody = ({ title, author, subType }) => {
  return (
    <div className="card-body h-28 rounded-b-xl w-full">
      <h2 className={`card-title text-md ${title ? "" : "text-gray-500"}`}>
        {title || "My awesome new submission"}
      </h2>
      <p className="text-sm">{formatAddress(author)}</p>
    </div>
  );
};

const RenderImagePreview = ({ image }: { image: string }) => {
  return (
    <div className="flex flex-col">
      <Image
        src={image}
        alt="submission preview"
        width={640}
        height={360}
        className="rounded-t-xl"
      />
    </div>
  );
};

const RenderTextPreview = ({
  text,
  title,
  author,
}: {
  text: React.ReactNode;
  title: string;
  author: string;
}) => {
  return (
    <div className="card-body h-64 bg-white/90 rounded-xl text-black/80 gap-1 w-full overflow-auto">
      <h2 className="break-word font-bold text-2xl">
        {title || "My awesome new submission"}
      </h2>
      <h3 className="break-all italic">{formatAddress(author)}</h3>
      <section className="break-all">{text}</section>
    </div>
  );
};

const RenderVideoPreview = ({
  video,
  thumbnail,
}: {
  video: string;
  thumbnail: string;
}) => {
  return (
    <MediaController className="rounded-t-xl">
      <video
        slot="media"
        src={video}
        poster={thumbnail}
        preload="auto"
        muted
        crossOrigin=""
        className="rounded-t-xl h-64 w-full object-cover"
      />
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <MediaMuteButton></MediaMuteButton>
      </MediaControlBar>
    </MediaController>
  );
};

const TwitterSubmit = ({
  params,
}: {
  params: { name: string; id: string };
}) => {
  return (
    <div className="flex flex-col border border-border w-full gap-16">
      <Step1 contestId={params.id} />
      <Step2 contestId={params.id} />
      <Step3 contestId={params.id} spaceName={params.name} />
    </div>
  );
};

export default TwitterSubmit;
