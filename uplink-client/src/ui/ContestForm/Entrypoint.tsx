"use client";
import { Fragment, useEffect, useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  initialState,
  ContestReducer,
  validateMetadata,
  validateDeadlines,
  validatePrompt,
  validateSubmitterRewards,
  validateVoterRewards,
  validateVotingPolicy,
  ContestBuilderProps,
  postContest,
} from "@/ui/ContestForm/contestHandler";
import { IToken } from "@/types/token";
import ContestMetadata from "@/ui/ContestForm/ContestMetadata";
import Deadlines from "@/ui/ContestForm/Deadlines";
import Prompt from "@/ui/ContestForm/Prompt";
import SubmitterRewards from "@/ui/ContestForm/SubmitterRewards";
import VoterRewards from "@/ui/ContestForm/VoterRewards";
import SubmitterRestrictions from "@/ui/ContestForm//SubmitterRestrictions";
import VotingPolicy from "@/ui/ContestForm//VotingPolicy";
import Extras from "@/ui/ContestForm//AdditionalParameters";
import { useRouter } from "next/navigation";
import { HiArrowNarrowLeft, HiBadgeCheck } from "react-icons/hi";
import {
  HiOutlineDocument,
  HiOutlineInformationCircle,
  HiOutlineLockClosed,
  HiPlusCircle,
  HiSparkles,
  HiXCircle,
} from "react-icons/hi2";
import { BiCategoryAlt, BiTime } from "react-icons/bi";
import { LuCoins, LuSettings2, LuVote } from "react-icons/lu";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import useSWRMutation from "swr/mutation";
import CreateContestTweet from "./CreateContestTweet";
import { toast } from "react-hot-toast";
import { useSession } from "@/providers/SessionProvider";

const validateContestParams = (contestState: ContestBuilderProps) => {
  const {
    errors: metadataErrors,
    isError: isMetadataError,
    data: metadata,
  } = validateMetadata(contestState.metadata);

  const {
    errors: deadlineErrors,
    isError: isDeadlineError,
    data: deadlines,
  } = validateDeadlines(contestState.deadlines, true);

  const {
    errors: promptErrors,
    isError: isPromptError,
    data: prompt,
  } = validatePrompt(contestState.prompt);

  const {
    errors: submitterRewardsErrors,
    isError: isSubmitterRewardsError,
    data: submitterRewards,
  } = validateSubmitterRewards(contestState.submitterRewards);

  const {
    errors: voterRewardsErrors,
    isError: isVoterRewardsError,
    data: voterRewards,
  } = validateVoterRewards(contestState.voterRewards);

  const {
    errors: votingPolicyErrors,
    isError: isVotingPolicyError,
    data: votingPolicy,
  } = validateVotingPolicy(contestState.votingPolicy);

  // no need for validation on submitter restrictions or additional params
  const submitterRestrictions = contestState.submitterRestrictions;
  const additionalParams = contestState.additionalParams;

  const errors = {
    metadata: metadataErrors,
    deadlines: deadlineErrors,
    prompt: promptErrors,
    submitterRewards: submitterRewardsErrors,
    voterRewards: voterRewardsErrors,
    votingPolicy: votingPolicyErrors,
  };

  const isError =
    isMetadataError ||
    isDeadlineError ||
    isPromptError ||
    isSubmitterRewardsError ||
    isVoterRewardsError ||
    isVotingPolicyError;

  const data = {
    metadata,
    deadlines,
    prompt,
    submitterRewards,
    voterRewards,
    submitterRestrictions,
    votingPolicy,
    additionalParams,
  } as ContestBuilderProps;

  return {
    errors,
    isError,
    data,
  };
};

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
      <div className="alert bg-transparent p-1 pl-0 w-fit text-primary">
        {info && (
          <div className="flex flex-row gap-2 text-sm md:text-md lg:text-base w-full p-0">
            <HiSparkles className="lg:w-5 lg:h-5 w-3 h-3" />
            {info}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center p-4 lg:p-8 gap-4">
        {children}
      </div>
    </div>
  );
};

const ParamsCard = ({
  title,
  icon,
  stepIndex,
  setCurrentStep,
  error,
  required,
}: {
  title: string;
  icon: React.ReactNode;
  stepIndex: number;
  setCurrentStep: (stepIndex: number) => void;
  error: boolean;
  required?: boolean;
}) => {
  return (
    <div
      className={`box cursor-pointer bg-base-100 p-2 rounded-xl flex flex-col gap-2 items-center justify-evenly relative transform 
      transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform ${
        error && "border-2 border-error"
      }`}
      onClick={() => setCurrentStep(stepIndex)}
    >
      <h2 className="font-bold text-t1 text-xl text-center">{title}</h2>
      {icon}
      {required && (
        <div className="badge badge-outline text-t2 badge-xs font-medium p-2 ml-auto">
          <p>required</p>
        </div>
      )}
      {error && (
        <HiXCircle className="text-error absolute -top-5 -right-5 h-8 w-8" />
      )}
    </div>
  );
};

const ContestParamSectionCards = ({ steps, onSubmit }) => {
  return (
    <div className="flex flex-col gap-4 lg:gap-8 w-10/12 m-auto">
      <h1 className="text-3xl font-bold">Create a Contest</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
        {steps.map((step, idx) => {
          return <Fragment key={idx}>{step.componentCard}</Fragment>;
        })}
      </div>
      <div className="ml-auto w-fit">
        <WalletConnectButton styleOverride="w-full btn-primary">
          <button className="btn btn-success normal-case" onClick={onSubmit}>
            Submit
          </button>
        </WalletConnectButton>
      </div>
    </div>
  );
};

const ContestForm = ({
  spaceName,
  spaceId,
  spaceTokens,
}: {
  spaceName: string;
  spaceId: string;
  spaceTokens: IToken[];
}) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const { data: session, status } = useSession();
  // add ETH to the spaceTokens array if it doesn't exist
  const spaceTokensWithEth: IToken[] = spaceTokens.some(
    (token) => token.type === "ETH" && token.symbol === "ETH"
  )
    ? spaceTokens
    : [{ type: "ETH", symbol: "ETH", decimals: 18 }, ...spaceTokens];

  const [contestState, setContestState] = useReducer(
    ContestReducer,
    initialState
  );
  const setField = (field, value) => {
    setContestState({ type: "SET_FIELD", field, value });
  };

  const setFieldErrors = (value) => {
    setContestState({
      type: "SET_ERRORS",
      value: { ...contestState.errors, ...value },
    });
  };

  const setTotalState = (data) => {
    setContestState({ type: "SET_TOTAL_STATE", value: data });
  };

  const handleBack = () => {
    setFieldErrors({
      [steps[currentStep].name]: initialState.errors[steps[currentStep].name],
    });
    setCurrentStep(-1);
  };

  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    `/api/createContest/${spaceId}`,
    postContest,
    {
      onError: (err) => {
        console.log(err);
        reset();
      },
    }
  );

  const onSubmit = async () => {
    //1. validate and clean data once more
    //2. return early if validation fails
    //3. if validation passes, send to server
    //4. if server returns success, render success screen
    //5. if server returns error, render error screen

    const { errors, isError, data } = validateContestParams(contestState);
    setTotalState({ ...data, errors });
    if (isError) return;
    try {
      await trigger({
        csrfToken: session.csrfToken,
        contestData: {
          ...data,
          prompt: {
            title: data.prompt.title,
            body: data.prompt.body,
            coverUrl: data.prompt.coverUrl,
          },
          spaceId,
        },
      });
    } catch (e) {
      reset();
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const steps = [
    {
      name: "metadata",
      component: (
        <ContestMetadata
          initialMetadata={contestState.metadata}
          handleConfirm={(data) => {
            setField("metadata", data);
            handleBack();
          }}
          errors={contestState.errors.metadata}
          setErrors={(errors) => {
            setFieldErrors({ metadata: errors });
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Contest Type"
          icon={<BiCategoryAlt className="w-24 h-24 text-primary" />}
          stepIndex={0}
          setCurrentStep={setCurrentStep}
          error={
            contestState.errors.metadata.type ||
            contestState.errors.metadata.category
          }
          required
        />
      ),
    },

    {
      name: "deadlines",
      component: (
        <Deadlines
          initialDeadlines={contestState.deadlines}
          handleConfirm={(data) => {
            setField("deadlines", data);
            handleBack();
          }}
          errors={contestState.errors.deadlines}
          setErrors={(errors) => {
            setFieldErrors({ deadlines: errors });
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Deadlines"
          icon={<BiTime className="w-24 h-24 text-error" />}
          stepIndex={1}
          setCurrentStep={setCurrentStep}
          error={
            contestState.errors.deadlines.startTime ||
            contestState.errors.deadlines.voteTime ||
            contestState.errors.deadlines.endTime ||
            contestState.errors.deadlines.snapshot
          }
          required
        />
      ),
    },

    {
      name: "prompt",
      component: (
        <Prompt
          initialPrompt={contestState.prompt}
          handleConfirm={(data) => {
            setField("prompt", data);
            handleBack();
          }}
          errors={contestState.errors.prompt}
          setErrors={(errors) => {
            setFieldErrors({ prompt: errors });
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Prompt"
          icon={<HiOutlineDocument className="w-24 h-24 text-purple-500" />}
          stepIndex={2}
          setCurrentStep={setCurrentStep}
          error={
            contestState.errors.prompt.title ||
            contestState.errors.prompt.body ||
            contestState.errors.prompt.coverUrl
          }
          required
        />
      ),
    },
    {
      name: "votingPolicy",
      component: (
        <VotingPolicy
          initialVotingPolicy={contestState.votingPolicy}
          spaceTokens={spaceTokensWithEth}
          handleConfirm={(data) => {
            setField("votingPolicy", data);
            handleBack();
          }}
          errors={contestState.errors.votingPolicy}
          setErrors={(errors) => {
            setFieldErrors({ votingPolicy: errors });
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Voting Policy"
          icon={<LuVote className="w-24 h-24 text-warning" />}
          stepIndex={3}
          setCurrentStep={setCurrentStep}
          required
          error={contestState.errors.votingPolicy}
        />
      ),
    },

    {
      name: "submitterRewards",
      component: (
        <SubmitterRewards
          initialSubmitterRewards={contestState.submitterRewards}
          spaceTokens={spaceTokensWithEth}
          handleConfirm={(data) => {
            setField("submitterRewards", data);
            handleBack();
          }}
          errors={contestState.errors.submitterRewards}
          setErrors={(errors) => {
            setFieldErrors({ submitterRewards: errors });
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Submitter Rewards"
          icon={<LuCoins className="w-24 h-24 text-green-400" />}
          stepIndex={4}
          setCurrentStep={setCurrentStep}
          error={contestState.errors.submitterRewards.duplicateRanks.length > 0}
        />
      ),
    },

    {
      name: "voterRewards",
      component: (
        <VoterRewards
          initialVoterRewards={contestState.voterRewards}
          spaceTokens={spaceTokensWithEth}
          handleConfirm={(data) => {
            setField("voterRewards", data);
            handleBack();
          }}
          errors={contestState.errors.voterRewards}
          setErrors={(errors) => {
            setFieldErrors({ voterRewards: errors });
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Voter Rewards"
          icon={<LuCoins className="w-24 h-24 text-purple-500" />}
          stepIndex={5}
          setCurrentStep={setCurrentStep}
          error={contestState.errors.voterRewards.duplicateRanks.length > 0}
        />
      ),
    },
    {
      name: "submitterRestrictions",
      component: (
        <SubmitterRestrictions
          initialSubmitterRestrictions={contestState.submitterRestrictions}
          spaceTokens={spaceTokensWithEth}
          handleConfirm={(data) => {
            setField("submitterRestrictions", data);
            handleBack();
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Submitter Restrictions"
          icon={<HiOutlineLockClosed className="w-24 h-24 text-orange-600" />}
          stepIndex={6}
          setCurrentStep={setCurrentStep}
          error={false}
        />
      ),
    },

    {
      name: "additionalParams",
      component: (
        <Extras
          initialExtras={contestState.additionalParams}
          handleConfirm={(data) => {
            setField("additionalParams", data);
            handleBack();
          }}
        />
      ),
      componentCard: (
        <ParamsCard
          title="Extras"
          icon={<LuSettings2 className="w-24 h-24 text-t2" />}
          stepIndex={7}
          setCurrentStep={setCurrentStep}
          error={false}
        />
      ),
    },
  ];

  if (isMutating)
    return (
      <div className="flex items-center justify-center w-full h-[80vh] ">
        <LoadingAnimation />
      </div>
    );
  else
    return (
      <AnimatePresence mode="wait">
        {!data && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex flex-col gap-8 m-4 w-full"
          >
            {currentStep > -1 ? (
              <div className="w-full flex flex-col gap-2 ">
                <button
                  className="btn btn-ghost self-start"
                  onClick={handleBack}
                >
                  <HiArrowNarrowLeft className="w-8 h-8" />
                </button>
                {steps[currentStep].component}
              </div>
            ) : (
              <ContestParamSectionCards
                steps={steps}
                onSubmit={() => {
                  onSubmit();
                }}
              />
            )}
          </motion.div>
        )}
        {data &&
          data.success && ( // contest has been submitted
            <motion.div className="flex flex-col gap-8 w-full h-screen items-center justify-center mr-16">
              <FinalStep
                contestState={contestState}
                spaceName={spaceName}
                contestId={data.contestId}
                spaceId={spaceId}
              />
            </motion.div>
          )}
      </AnimatePresence>
    );
};

// sidebar for adding contest state elements
// tweet homescreen
// options for tweeting now vs closer to contest start

const AddTweetDialogue = ({
  contestState,
  contestId,
  spaceName,
  spaceId,
}: {
  contestState: ContestBuilderProps;
  contestId: string;
  spaceName: string;
  spaceId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTweeted, setHasTweeted] = useState(false);
  const router = useRouter();

  const onSuccess = () => {
    toast.success("Successfully scheduled your tweet");
    setHasTweeted(true);
  };

  const customDecorators: {
    type: "text";
    data: string;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: "text",
      data: `\nbegins ${new Date(
        contestState.deadlines.startTime
      ).toLocaleString("en-US", {
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
      data: `\n${contestState.prompt.title}`,
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

  if (hasTweeted)
    return <RenderSuccessScreen contestId={contestId} spaceName={spaceName} />;
  else
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-4 w-10/12 md:w-1/3 h-1/2 bg-base-100 rounded-xl transition-colors duration-300 ease-in-out animate-springUp">
        <HiOutlineInformationCircle className="w-32 h-32 text-primary" />
        <p className="text-2xl text-t1 text-center">Before you go...</p>
        <div className="bg-base-200 p-4 rounded-xl">
          <p className="text-lg text-t1 text-center">
            Your contest will be hidden until you create an announcement tweet.
            You can create one now, or add one from the contest page at any
            time.
          </p>
        </div>
        <div className="flex flex-row gap-6">
          <button
            className="btn btn-ghost text-t2"
            onClick={() => {
              router.refresh();
              router.push(`/${spaceName}/contest/${contestId}`);
            }}
          >
            Go to contest
          </button>
          <button
            className="btn btn-ghost text-primary"
            onClick={() => setIsModalOpen(true)}
          >
            add tweet
          </button>
        </div>
        <CreateContestTweet
          contestId={contestId}
          spaceId={spaceId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSuccess={onSuccess}
          onError={() => {}}
          customDecorators={customDecorators}
        />
      </div>
    );
};

const FinalStep = ({ contestState, spaceName, contestId, spaceId }) => {
  const isTwitter = contestState.metadata.type === "twitter";
  if (isTwitter) {
    return (
      <AddTweetDialogue
        contestState={contestState}
        contestId={contestId}
        spaceName={spaceName}
        spaceId={spaceId}
      />
    );
  } else
    return <RenderSuccessScreen contestId={contestId} spaceName={spaceName} />;
};
const RenderSuccessScreen = ({ contestId, spaceName }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-2 w-10/12 md:w-1/3 h-1/2 bg-base-100 rounded-xl transition-colors duration-300 ease-in-out animate-springUp">
      <HiBadgeCheck className="w-32 h-32 text-success" />
      <p className="text-2xl text-t1 text-center">{`Ok legend - you're all set`}</p>
      <button
        className="btn btn-ghost text-t2"
        onClick={() => {
          router.refresh();
          router.push(`/${spaceName}/contest/${contestId}`);
        }}
      >
        Go to contest
      </button>
    </div>
  );
};

export default ContestForm;
