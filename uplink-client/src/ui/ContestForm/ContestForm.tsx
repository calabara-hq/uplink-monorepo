"use client";
import {
  useReducer,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  Fragment,
  useMemo,
  Suspense,
} from "react";
import {
  ContestBuilderProps,
  cleanSubmitterRewards,
  cleanVoterRewards,
  reducer,
  validateAllContestBuilderProps,
  validateStep,
} from "@/lib/contestHandler";
import StandardPrompt from "./StandardPrompt";
import Deadlines from "./Deadlines";
import ContestMetadata from "./ContestMetadata";
import SubmitterRewardsComponent from "./SubmitterRewards";
import VoterRewardsComponent from "./VoterRewards";
import SubmitterRestrictions from "./SubmitterRestrictions";
import VotingPolicy from "./VotingPolicy";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AnimatePresence, motion } from "framer-motion";
import useHandleMutation from "@/hooks/useHandleMutation";
import { CreateContestDocument } from "@/lib/graphql/contests.gql";
import { toast } from "react-hot-toast";
import AdditionalParameters from "./AdditionalParameters";
import {
  HiCheckBadge,
  HiXCircle,
  HiPencilSquare,
  HiEllipsisHorizontalCircle,
  HiExclamationTriangle,
} from "react-icons/hi2";

import InfoAlert from "../InfoAlert/InfoAlert";
import { TypeAnimation } from "react-type-animation";

import { useRouter } from "next/navigation";
import CreateThread from "../CreateThread/CreateThread";
import { ThreadItem } from "@/hooks/useThreadCreator";
import { nanoid } from "nanoid";

export const BlockWrapper = ({
  title,
  info,
  children,
}: {
  title: string;
  info?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="border-2 border-border shadow-box p-6 rounded-xl">
      <h1 className="text-2xl font-bold">{title}</h1>
      {info && <InfoAlert>{info}</InfoAlert>}
      <div className="flex flex-col items-center p-4 lg:p-8 gap-4">
        {children}
      </div>
    </div>
  );
};

const initialState = {
  metadata: {
    type: null,
    category: null,
  },
  deadlines: {
    snapshot: "now",
    startTime: "now",
    voteTime: new Date(Date.now() + 2 * 864e5).toISOString(),
    endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
  },

  prompt: {
    title: "",
    body: null,
  },

  spaceTokens: [
    {
      type: "ETH",
      symbol: "ETH",
      decimals: 18,
    },

    {
      type: "ERC1155",
      address: "0xab0ab2fc1c498942B24278Bbd86bD171a3406A5E",
      symbol: "MmSzr",
      decimals: 0,
    },
    {
      type: "ERC20",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      decimals: 6,
    },
    {
      type: "ERC20",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      symbol: "USDT",
      decimals: 18,
    },
    {
      type: "ERC721",
      address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
      symbol: "NOUN",
      decimals: 0,
    },
  ],
  submitterRewards: {},
  voterRewards: {},
  submitterRestrictions: [],
  votingPolicy: [],
  additionalParams: {
    anonSubs: true,
    visibleVotes: false,
    selfVote: false,
    subLimit: 1,
  },
  tweetThread: [],

  errors: {},
} as ContestBuilderProps;

const ContestForm = ({
  spaceName,
  spaceId,
}: {
  spaceName: string;
  spaceId: string;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [settingsLocked, setSettingsLocked] = useState<boolean>(false);

  const handleSettingsValidation = async () => {
    const {
      isError,
      errors: validationErrors,
      values,
    } = validateAllContestBuilderProps(state);
    if (!isError) return setSettingsLocked(true);

    // on error, set the current step to the first step with errors
    const firstErrorStep = steps.findIndex(
      (step) => step.errorField in validationErrors
    );
    setCurrentStep(firstErrorStep);

    dispatch({
      type: "setErrors",
      payload: validationErrors,
    });
    setSettingsLocked(false);
    return null;
  };

  const steps = [
    {
      name: "Contest Type",
      component: <ContestMetadata state={state} dispatch={dispatch} />,
      errorField: "metadata",
    },
    {
      name: "Deadlines",
      component: <Deadlines state={state} dispatch={dispatch} />,
      errorField: "deadlines",
    },
    {
      name: "Prompt",
      component: <StandardPrompt state={state} dispatch={dispatch} />,
      errorField: "prompt",
    },
    {
      name: "Submitter Rewards",
      component: (
        <SubmitterRewardsComponent state={state} dispatch={dispatch} />
      ),
      errorField: "submitterRewards",
    },
    {
      name: "Voter Rewards",
      component: <VoterRewardsComponent state={state} dispatch={dispatch} />,
      errorField: "voterRewards",
    },
    {
      name: "Restrictions",
      component: <SubmitterRestrictions state={state} dispatch={dispatch} />,
      errorField: "submitterRestrictions",
    },
    {
      name: "Voting Policy",
      component: <VotingPolicy state={state} dispatch={dispatch} />,
      errorField: "votingPolicy",
    },
    {
      name: "Additional Parameters",
      component: <AdditionalParameters state={state} dispatch={dispatch} />,
      errorField: "additionalParameters",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const res = validateStep(state, currentStep);
      if (res.isError) {
        return dispatch({ type: "setErrors", payload: res.errors });
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (settingsLocked) {
    return (
      <Finalize
        state={state}
        dispatch={dispatch}
        spaceName={spaceName}
        spaceId={spaceId}
      />
    );
  } else
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-[15%_auto] gap-8 lg:px-4 py-4 lg:py-8 w-full mr-auto ">
        <div className="flex flex-col lg:flex w-full items-start">
          <div className="flex flex-row flex-wrap gap-1 lg:flex-col h-full lg:w-fit lg:gap-4">
            {steps.map((el, index) => {
              const isActive = currentStep === index;
              const isCompleted = index < currentStep;
              const hasErrors = state.errors[el.errorField];

              const stepClass = isActive
                ? {
                    icon: <HiPencilSquare className="w-3 h-3 lg:w-6 lg:h-6" />,
                    style:
                      "btn btn-xs lg:btn-lg btn-ghost underline w-fit normal-case",
                  }
                : isCompleted
                ? {
                    icon: (
                      <HiCheckBadge className="w-3 h-3 lg:w-6 lg:h-6 fill-success" />
                    ),
                    style: "btn btn-xs lg:btn-lg btn-ghost w-fit normal-case",
                  }
                : hasErrors
                ? {
                    icon: (
                      <HiXCircle className="w-3 h-3 lg:w-6 lg:h-6  fill-error" />
                    ),
                    style:
                      "btn btn-xs lg:btn btn-ghost underline w-fit normal-case",
                  }
                : {
                    icon: (
                      <HiEllipsisHorizontalCircle className="w-3 h-3 lg:w-6 lg:h-6 fill-neutral" />
                    ),
                    style: "btn btn-xs lg:btn-lg btn-ghost  w-fit normal-case",
                  };

              return (
                <div
                  key={index}
                  className={`${stepClass.style} cursor-pointer p-2 rounded-lg text-left`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start gap-1 lg:gap-2">
                    {stepClass.icon}
                    {el.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col flex-grow w-full lg:w-10/12 gap-8 ml-auto mr-auto ">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {steps[currentStep].component}
              <div className="p-4" />
              <div className="btn-group grid grid-cols-2 w-full lg:w-1/3 m-auto">
                {currentStep > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}

                {currentStep === steps.length - 1 && (
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleSettingsValidation}
                  >
                    Finish
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
};

export default ContestForm;

const composeInferredThread = (state) => {
  const { prompt } = state;
  const { title, coverUrl, coverBlob } = prompt;

  const thread: ThreadItem[] = [
    {
      id: nanoid(),
      text: title,
      primaryAssetUrl: coverUrl ?? null,
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

const Finalize = ({
  state,
  dispatch,
  spaceId,
  spaceName,
}: {
  state: any;
  dispatch: any;
  spaceId: string;
  spaceName: string;
}) => {
  const [isReady, setIsReady] = useState(false);
  const initialThread =
    state.metadata.type === "twitter" ? composeInferredThread(state) : null;
  const handleMutation = useHandleMutation(CreateContestDocument);
  const router = useRouter();
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);

  const handleFormSubmit = async () => {
    const {
      isError,
      errors: validationErrors,
      values,
    } = validateAllContestBuilderProps(state);

    console.log("tweet thread", state.tweetThread);

    if (!values) return;

    const contestData = {
      spaceId,
      ...values,
      tweetThread: state.tweetThread, // TODO: handle validation for this
    };

    console.log(contestData);

    const res = await handleMutation({
      contestData,
    });

    if (!res) return;
    const { errors, success, contestId } = res.data.createContest;

    if (!success) {
      toast.error(
        "Oops, something went wrong. Please check the fields and try again."
      );
      console.log(errors);
    }

    if (success) {
      toast.success("Contest created successfully!", {
        icon: "🎉",
      });
      router.refresh();
      router.push(`${spaceName}/contests/${contestId}`);
    }
  };

  return (
    <div className="flex flex-col w-9/12 ml-auto mr-auto p-10 items-start justify-center gap-8">
      {!isReady && (
        <>
          <LoadingSpinner />
          <TypeAnimation
            sequence={[
              "Waking up",
              500,
              "Fetching my glasses",
              500,
              "Composing your contest",
              1000,
              () => {
                setIsReady(true);
              },
            ]}
            wrapper="span"
            speed={70}
            cursor={true}
            repeat={1}
            style={{ fontSize: "2em", display: "inline-block" }}
          />
        </>
      )}
      {isReady && (
        <div className="flex flex-col w-full gap-8">
          <BlockWrapper title="Summary">
            {/* metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-3 w-full gap-8"
            >
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-start"
              >
                <p className="font-bold">Metadata</p>
              </motion.div>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col  rounded-xl p-4 shadow-lg border-border border "
              >
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">Type: </p>
                  <p className="text-gray-200">{state.metadata.type}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">Category: </p>
                  <p className="text-gray-200">{state.metadata.category}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-end "
              >
                <HiCheckBadge className="w-10 h-10 fill-success" />
              </motion.div>
            </motion.div>
            <div className="h-0.5 w-full bg-base-100" />
            {/*deadlines */}
            <div className="grid grid-cols-3 w-full gap-8">
              <div className="flex items-center justify-start">
                <p className="font-bold">Metadata</p>
              </div>
              <div className="flex flex-col rounded-xl p-4  shadow-lg border border-border">
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">Start Time: </p>
                  <p className="text-gray-200">{state.deadlines.startTime}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">Vote Time: </p>
                  <p className="text-gray-200">{state.deadlines.voteTime}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">End Time:</p>
                  <p className="text-gray-200">{state.deadlines.voteTime}</p>
                </div>
              </div>
              <div className="flex items-center justify-end ">
                <HiCheckBadge className="w-10 h-10 fill-success" />
              </div>
            </div>
            <div className="h-0.5 w-full bg-base-100" />
            <div className="grid grid-cols-3 w-full gap-8">
              <div className="flex items-center justify-start">
                <p className="font-bold">Metadata</p>
              </div>
              <div className="flex flex-col rounded-xl p-4  shadow-lg border border-border">
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">Start Time: </p>
                  <p className="text-gray-200">{state.deadlines.startTime}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">Vote Time: </p>
                  <p className="text-gray-200">{state.deadlines.voteTime}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-white">End Time:</p>
                  <p className="text-gray-200">{state.deadlines.voteTime}</p>
                </div>
              </div>
              <div className="flex items-center justify-end ">
                <HiCheckBadge className="w-10 h-10 fill-success" />
              </div>
            </div>
            <div className="h-0.5 w-full bg-base-100" />

            {/* twitter */}
            {state.metadata.type === "twitter" && (
              <div className="grid grid-cols-3 w-full gap-8">
                <div className="flex flex-col items-start justify-center">
                  <p className="font-bold">Create Tweet</p>
                </div>
                <div className="flex flex-col rounded-xl p-4 gap-4 shadow-lg border border-border">
                  <p>Add a tweet to announce your contest</p>
                  <button
                    onClick={() => setIsTweetModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Create Tweet
                  </button>
                  <CreateThread
                    initialThread={initialThread}
                    isModalOpen={isTweetModalOpen}
                    setIsModalOpen={setIsTweetModalOpen}
                    confirmLabel="Save"
                    onConfirm={(thread) => {
                      dispatch({
                        type: "setTweetThread",
                        payload: thread.map(({ ...rest }) => ({
                          ...rest,
                        })),
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-end  gap-2">
                  <p className="text-s text-warning">needs your attention</p>
                  <HiExclamationTriangle className="w-10 h-10 fill-warning" />
                </div>
              </div>
            )}

            {/*
                <tr>
                  <td>
                    <p className="font-bold">Deadlines</p>
                  </td>
                  <td>
                    <div className="flex flex-col rounded-xl p-4 w-fit ml-auto shadow-lg border border-border">
                      <div className="flex flex-row gap-2">
                        <p className="font-bold text-white">Start Time: </p>
                        <p className="text-gray-200">
                          {state.deadlines.startTime}
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p className="font-bold text-white">Vote Time: </p>
                        <p className="text-gray-200">
                          {state.deadlines.voteTime}
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p className="font-bold text-white">End Time:</p>
                        <p className="text-gray-200">
                          {state.deadlines.voteTime}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

      */}
            <button
              className="btn btn-primary ml-auto"
              onClick={handleFormSubmit}
            >
              Launch
            </button>
          </BlockWrapper>
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <svg
      className="animate-ping -ml-1 mr-3 h-5 w-5 text-primary"
      width="34"
      height="50"
      viewBox="0 0 34 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.902244 14.6903C2.21382 13.7092 4.46223 13.7715 5.56562 14.8928C8.35533 17.7272 10 21.2156 10 25C10 28.7844 8.35533 32.2728 5.56562 35.1072C4.46223 36.2285 2.23464 36.2908 0.902244 35.3097C-0.221964 34.4843 -0.28442 33.1761 0.65242 32.2261C2.67535 30.1209 3.76068 27.5926 3.7544 25C3.7544 22.3058 2.60937 19.814 0.65242 17.7739C-0.263601 16.8239 -0.201145 15.5157 0.902244 14.6903Z"
        fill="#AB36BE"
      ></path>
      <path
        d="M11.0827 7.19235C12.6566 5.49767 15.3547 5.60527 16.6787 7.54205C20.0264 12.4378 22 18.4634 22 25C22 31.5366 20.0264 37.5622 16.6787 42.458C15.3547 44.3947 12.6816 44.5023 11.0827 42.8077C9.73364 41.382 9.6587 39.1224 10.7829 37.4815C13.2104 33.8452 14.5128 29.4782 14.5053 25C14.5053 20.3463 13.1312 16.0424 10.7829 12.5185C9.68368 10.8776 9.75863 8.61804 11.0827 7.19235Z"
        fill="#FF638D"
      ></path>
      <path
        d="M23.0827 1.56888C24.6566 -0.660966 27.3547 -0.519387 28.6787 2.02901C32.0264 8.4708 34 16.3992 34 25C34 33.6008 32.0264 41.5292 28.6787 47.971C27.3547 50.5194 24.6816 50.661 23.0827 48.4311C21.7336 46.5552 21.6587 43.5821 22.7829 41.423C25.2104 36.6385 26.5128 30.8924 26.5053 25C26.5053 18.8768 25.1312 13.2137 22.7829 8.57698C21.6837 6.41792 21.7586 3.44479 23.0827 1.56888Z"
        fill="#CC0595"
      />
    </svg>
  );
};
