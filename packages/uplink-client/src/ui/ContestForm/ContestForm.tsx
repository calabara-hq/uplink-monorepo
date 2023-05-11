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
import InfoAlert from "../InfoAlert/InfoAlert";

export const BlockWrapper = ({
  title,
  info,
  children,
}: {
  title: string;
  info: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">{title}</h1>
      <InfoAlert>{info}</InfoAlert>
      <div className="flex flex-col items-center p-4 lg:p-8 gap-4">{children}</div>
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

  errors: {},
} as ContestBuilderProps;

const ContestForm = ({ spaceName }: { spaceName: string }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const handleMutation = useHandleMutation(CreateContestDocument);

  const handleFinalValidation = async () => {
    const {
      isError,
      errors: validationErrors,
      values,
    } = validateAllContestBuilderProps(state);
    if (!isError) return values;

    // on error, set the current step to the first step with errors
    const firstErrorStep = steps.findIndex(
      (step) => step.errorField in validationErrors
    );
    setCurrentStep(firstErrorStep);

    dispatch({
      type: "setErrors",
      payload: validationErrors,
    });

    return null;
  };

  const handleFormSubmit = async () => {
    const values = await handleFinalValidation();
    if (!values) return;

    console.log(values);

    const res = await handleMutation({
      contestData: {
        spaceName,
        ...values,
      },
    });

    if (!res) return;
    const { errors, success } = res.data.createContest;

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
    }
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
      name: "Standard Prompt",
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
    {
      errorField: "none",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const res = validateStep(state, currentStep);
      console.log(res);
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

  const renderStepStatusIcon = (index: number) => {
    const step = steps[index];
    if (state.errors[step.errorField]) {
      return <span>x</span>;
    } else if (currentStep > index) {
      return <span>$</span>;
    } else {
      return <span>*</span>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-11/12 text-white px-4 py-8 ml-auto mr-auto">
      <div className="flex w-full lg:w-1/5 items-start ">
        <ul className="steps steps-horizontal lg:steps-vertical">
          {steps.map((el, index) => {
            const isActive = currentStep === index;
            const isCompleted = index < currentStep;
            const hasErrors = state.errors[el.errorField];

            const stepClass = isActive
              ? "step step-primary"
              : isCompleted
              ? "step step-success"
              : "step step-neutral";
            const dataContent = hasErrors ? "✕" : isCompleted ? "✓" : "●";

            return (
              <li
                key={index}
                data-content={dataContent}
                className={`${stepClass} cursor-pointer`}
                onClick={() => setCurrentStep(index)}
              >
                {el.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col w-full lg:w-4/5 gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {steps[currentStep].component}
            <div className="flex flex-row justify-between w-full">
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
                  onClick={handleFormSubmit}
                >
                  Save
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
