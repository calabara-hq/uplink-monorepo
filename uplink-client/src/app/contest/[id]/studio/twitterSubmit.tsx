"use client";
import { ThreadItem, ApiThreadItem } from "@/hooks/useThreadCreator";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import CreateThread from "@/ui/CreateThread/CreateThread";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";

import Stack from "@/ui/Stack/Stack";
import TwitterConnectButton from "@/ui/TwitterConnectButton/TwitterConnectButton";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { BiInfoCircle, BiPlusCircle } from "react-icons/bi";
import useSWRMutation from "swr/mutation";
import {
  HiCheckBadge,
  HiXCircle,
  HiXMark,
  HiOutlineLightBulb,
  HiPhoto,
  HiSparkles,
} from "react-icons/hi2";
import { ModalActions } from "@/ui/Modal/Modal";
import { Decimal } from "decimal.js";
import { IoMdCreate } from "react-icons/io";
import { HiArrowNarrowLeft, HiBadgeCheck } from "react-icons/hi";
import Link from "next/link";
import { handleMutationError } from "@/lib/handleMutationError";
import { SimplePreview } from "@/ui/Submission/CardSubmission";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";
import { useContestInteractionApi } from "@/hooks/useContestInteractionAPI";
import UplinkImage from "@/lib/UplinkImage"

async function postTwitterSubmission(
  url,
  {
    arg,
  }: {
    arg: {
      contestId: string;
      submission: {
        title: string;
        thread: ApiThreadItem[];
      };
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
      mutation Mutation($contestId: ID!, $submission: TwitterSubmissionPayload!) {
        createTwitterSubmission(contestId: $contestId, submission: $submission) {
          success
          submissionId
          userSubmissionParams {
              maxSubPower
              remainingSubPower
              userSubmissions {
                  type
              }
          }
        }
      }`,
      variables: {
        contestId: arg.contestId,
        submission: arg.submission,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.createTwitterSubmission);
}

const StepBox = ({ step }: { step: number }) => {
  return (
    <div className="flex w-12 h-12 rounded bg-base-200 items-center justify-center">
      <p>{step}</p>
    </div>
  );
};

const Step1 = ({ contestId }: { contestId: string }) => {
  const { data: session, status } = useSession();
  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } = useContestInteractionApi(contestId);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="flex flex-row md:flex-col lg:flex-row gap-2 ">
        <StepBox step={1} />
        <div className="flex flex-col">
          <p className="text-xl text-t1">Check your eligibility</p>
          <p className="text-t2">Verify that you meet the entry requirements</p>
        </div>
      </div>
      <div className="w-56 h-56">
        <Stack
          layer1={
            <div className="flex flex-row justify-between text-xs font-bold items-center">
              <p>status</p>
              <div className="flex flex-row gap-2 items-center">
                {userSubmitParams ? (
                  new Decimal(userSubmitParams.remainingSubPower).greaterThan(
                    0
                  ) ? (
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
            <div className="flex flex-col gap-2 h-full w-full">
              <p className="font-bold">Eligibility</p>

              <WalletConnectButton styleOverride="w-full btn-primary">
                <span className="hidden" />
              </WalletConnectButton>
              {userSubmitParams && (
                <div className="flex flex-col items-center justify-center h-full">
                  {userSubmitParams.restrictionResults.length === 0 ? (
                    <div className="flex flex-row gap-2 items-center">
                      <p className="text-t2">No entry requirements</p>
                    </div>
                  ) : (
                    userSubmitParams.restrictionResults
                      .slice(0, 4)
                      .map((el, idx) => {
                        return (
                          <div
                            key={idx}
                            className="flex flex-row gap-2 items-center text-sm text-t2"
                          >
                            <p>
                              {el.restriction.tokenRestriction.threshold.toString()}{" "}
                              {el.restriction.tokenRestriction.token.symbol}
                            </p>
                            {el.result === true ? (
                              <HiCheckBadge className="text-success w-4 h-4 ml-auto" />
                            ) : (
                              <HiXCircle className="w-4 h-4 ml-auto" />
                            )}
                          </div>
                        );
                      })
                  )}
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
  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } = useContestInteractionApi(contestId);
  const isDisabled =
    status !== "authenticated" ||
    !userSubmitParams ||
    new Decimal(userSubmitParams.remainingSubPower).lessThanOrEqualTo(0);

  const disabledClass = isDisabled ? "opacity-50 pointer-events-none" : "";

  return (
    <div
      className={`flex flex-col md:flex-row-reverse  gap-4 justify-between items-center transition duration-300 ${disabledClass}`}
    >
      <div className="flex flex-row md:flex-col lg:flex-row gap-2 items-center md:items-end lg:items-center">
        <StepBox step={2} />
        <div className="flex flex-col">
          <p className="text-xl text-t1">Link your Twitter</p>
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
                <div className="flex flex-col gap-2 items-center justify-between h-full ">
                  <UplinkImage
                    src={session?.user?.twitter?.profile_image_url_large}
                    alt="twitter profile image"
                    width={96}
                    height={96}
                    className="rounded-full w-full h-full max-w-[100px] max-h-[100px] m-auto"
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
}: {
  contestId: string;
}) => {
  const { data: session, status } = useSession();
  const isReady = status === "authenticated" && session?.user?.twitter !== null;
  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } = useContestInteractionApi(contestId);
  const [title, setTitle] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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
    new Decimal(userSubmitParams.remainingSubPower).lessThanOrEqualTo(0);

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
        className={`flex flex-col md:flex-row gap-4 justify-between items-center transition duration-300 ${disabledClass}`}
      >
        <div className="flex flex-row md:flex-col lg:flex-row gap-2 items-center md:items-start lg:items-center">
          <StepBox step={3} />
          <div className="flex flex-col">
            <p className="text-xl text-t1">Create your submission!</p>
          </div>
        </div>
        <div className="w-56 h-56">
          <Stack
            layer1={
              <div className="flex flex-row justify-between text-xs font-bold items-center">
                <p>status</p>
                <div className="flex flex-row gap-2 items-center">
                  {isCreating ? (
                    <>
                      <p className="ml-auto">creating</p>
                      <IoMdCreate className="text-primary w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="ml-auto">brainstorming</p>
                      <HiOutlineLightBulb className="w-5 h-5 opacity-50" />
                    </>
                  )}
                </div>
              </div>
            }
            layer2={
              <div className="flex flex-col gap-2 h-full">
                <p className="font-bold">Create</p>
                <button
                  className="btn btn-primary normal-case"
                  onClick={() => {
                    setIsTweetModalOpen(true);
                    setIsCreating(true);
                  }}
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
}: {
  thread: ThreadItem[];
  title: string;
  setTitle: (title: string) => void;
  isModalOpen: boolean;
  handleClose: () => void;
  handleRevert: () => void;
  contestId: string;
}) => {
  const { data: session, status } = useSession();
  const { mutateLiveSubmissions } = useLiveSubmissions(contestId);
  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    [`/api/userSubmitParams/${contestId}`, session?.user?.address],
    postTwitterSubmission,
    {
      onError: (err) => {
        console.log(err);
        onClose();
      },
    }
  );

  useEffect(() => {
    return reset();
  }, []);

  const onClose = () => {
    handleClose();
    reset();
  };

  const handleSubmit = async () => {
    const submission: {
      title: string;
      thread: ApiThreadItem[];
    } = {
      title: title,
      thread: thread.map((el) => {
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
    };
    try {
      await trigger({ contestId, submission, csrfToken: session.csrfToken });
      mutateLiveSubmissions();
    } catch (err) {
      console.log(err);
      onClose();
    }
  };

  const submissionType = thread[0].isVideo
    ? "video"
    : thread[0].primaryAssetBlob
      ? "image"
      : "text"

  if (isModalOpen && !data) {
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
              <SimplePreview
                submission={{
                  id: "0",
                  contestId: "0",
                  created: "0",
                  url: "xyz",
                  version: "preview",
                  author: {
                    id: session?.user?.id,
                    address: session?.user?.address as `0x${string}`,
                    userName: session?.user?.userName,
                    displayName: session?.user?.displayName,
                    profileAvatar: session?.user?.profileAvatar,
                    twitterHandle: null,
                    twitterAvatar: null,
                    visibleTwitter: false,
                    submissions: []
                  },
                  totalVotes: null,
                  rank: null,
                  type: "twitter",
                  edition: null,
                  data: {
                    type: submissionType,
                    title: title,
                    thread: [
                      {
                        text: thread[0].text,
                        previewAsset: thread[0].isVideo
                          ? thread[0].videoThumbnailOptions[
                          thread[0].videoThumbnailBlobIndex
                          ]
                          : thread[0].primaryAssetBlob,
                        videoAsset: thread[0].isVideo
                          ? thread[0].primaryAssetBlob
                          : null,
                        assetSize: 1,
                        assetType: null,
                      },
                    ],
                  },
                }}
              />
            </div>
          </div>

          <ModalActions
            confirmLabel="submit"
            cancelLabel="edit tweet"
            confirmDisabled={!title || isMutating}
            isLoading={isMutating}
            onConfirm={handleSubmit}
            onCancel={() => {
              handleRevert();
              onClose();
            }}
          />
        </div>
      </div>
    );
  }
  if (isModalOpen && data && data.success)
    return (
      <div className="modal modal-open bg-[#00000080] transition-colors duration-300 ease-in-out">
        <div className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-2xl animate-springUp">
          <div className="flex flex-col items-center justify-center gap-6 p-2 w-10/12 m-auto rounded-xl">
            <HiBadgeCheck className="w-32 h-32 text-success" />
            <p className="text-2xl text-t1 text-center">{`Ok creatoooooooor - you're all set`}</p>
            <div className="flex gap-4 items-center">
              <Link
                href={`/contest/${contestId}`}
                draggable={false}
                className="btn btn-ghost text-t2 normal-case"
              >
                Go to contest
              </Link>
              {submissionType !== 'text' && <Link
                href={`/contest/${contestId}/create-drop?sid=${data.submissionId}`}
                draggable={false}
                className="btn btn-primary normal-case"
              >
                <div className="flex gap-2 items-center">
                  <p>Create Drop</p>
                  <HiSparkles className="w-5 h-5" />
                </div>
              </Link>
              }
            </div>
          </div>
        </div>
      </div>
    );
};


const ExplainerSection = () => {
  const handleClickScroll = () => {
    const element = document.getElementById("scrollTo");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",

      });
    }
  };

  return (
    <div className="from-[#00223390] to-[#002233] text-white grid place-items-center items-center bg-gradient-to-br rounded-xl">
      <div className="relative hero-content col-start-1 row-start-1 w-full flex-col justify-between gap-10 pb-10 lg:pb-0 lg:flex-row  lg:gap-0 xl:gap-20  ">
        <div className="lg:pl-10 ">
          <div className="mb-2 py-4 text-center lg:text-left ">
            <h1 className="font-title mb-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              Twitter Contest
            </h1>
            <h2 className="font-title text-lg font-extrabold sm:text-xl lg:text-2xl text-t1">
              Create a submission in 3 easy steps.
              <br />
              {`When you're done, we'll tweet it`}
              <br />
              for you!
            </h2>
            <button className="btn btn-ghost btn-active hover:bg-base-200 normal-case mt-2 ml-auto" onClick={handleClickScroll}>
              Lets go
            </button>
          </div>
        </div>
        <div className="m-auto w-full max-w-[300px] sm:max-w-sm  animate-springUp">
          <div className="mockup-window bg-base-100 border border-border">
            <div className="grid grid-cols-[32px_auto] md:grid-cols-[64px_auto] bg-base-200 p-4">
              <UplinkImage
                src={"/swim-shady.png"}
                alt="swim shady"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-grow flex flex-col gap-2 ml-4">
                <p className="text-t1">Noun 9999 in 3333D!</p>
                <div className="flex flex-col w-10/12 m-auto">
                  <div className="relative">
                    <UplinkImage
                      src={"/9999-winner.jpeg"}
                      alt="twitter submission"
                      width={200}
                      height={200}
                      className="rounded-lg object-contain"
                    />
                  </div>
                </div>
                <div className="w-full h-0.5 bg-border"></div>
                <div className="flex items-center justify-start w-full">
                  <HiPhoto className="w-5 h-5 opacity-50" />
                  <BiPlusCircle className="w-5 h-5 opacity-50 ml-auto mr-2" />
                  <button
                    className="btn btn-xs btn-primary normal-case"
                    disabled
                  >
                    Submitting
                    <div
                      className="text-xs ml-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg
        className="fill-[#57BAD7] col-start-1 row-start-1 h-auto w-full self-end rounded-t-xl"
        width="1600"
        height="410"
        viewBox="0 0 1600 410"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 338L53.3 349.2C106.7 360.3 213.3 382.7 320 393.8C426.7 405 533.3 405 640 359.3C746.7 313.7 853.3 222.3 960 189.2C1066.7 156 1173.3 181 1280 159.2C1386.7 137.3 1493.3 68.7 1546.7 34.3L1600 0V595H1546.7C1493.3 595 1386.7 595 1280 595C1173.3 595 1066.7 595 960 595C853.3 595 746.7 595 640 595C533.3 595 426.7 595 320 595C213.3 595 106.7 595 53.3 595H0V338Z"></path>
      </svg>
      <div id="scrollTo" />
    </div>
  );
};

const TwitterSubmit = ({
  params,
}: {
  params: { id: string };
}) => {
  return (
    <div className="flex flex-col w-full">
      <Link
        href={`/contest/${params.id}`}
        draggable={false}
        className="btn btn-ghost normal-case text-t2 w-fit mb-1"
      >
        <HiArrowNarrowLeft className="w-5 h-5" />
        <span className="w-1" />
        <p className="hidden lg:flex">Back to Contest</p>
      </Link>
      <ExplainerSection />
      <div className="h-[20vh] bg-[#57BAD7] rounded-b-xl mb-8" />
      <div className="w-full bg-base border-2 border-base-100 rounded-xl p-4">
        <div className="flex flex-col w-full md:w-3/4 xl:w-1/2 m-auto gap-8">
          <Step1 contestId={params.id} />
          <div className="h-0.5 w-full flex  bg-base-100" />
          <Step2 contestId={params.id} />
          <div className="h-0.5 w-full  bg-base-100" />
          <Step3 contestId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default TwitterSubmit;
