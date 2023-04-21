"use client";
import {
  useReducer,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import {
  ContestBuilderProps,
  reducer,
  validateStep,
} from "@/app/contestbuilder/contestHandler";
import StandardPrompt from "./StandardPrompt";
import Deadlines from "./Deadlines";
import ContestType from "./ContestType";
import SubmitterRewardsComponent from "./SubmitterRewards";
import VoterRewardsComponent from "./VoterRewards";
import SubmitterRestrictions from "./SubmitterRestrictions";
import VotingPolicy from "./VotingPolicy";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export const BlockWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-black/30 p-6 rounded-lg">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="p-2" />
      <div className="flex flex-col items-center p-6">{children}</div>
    </div>
  );
};

const ContestSchema = Yup.object<ContestBuilderProps>({
  type: Yup.string().nullable().required("Required"),
  startTime: Yup.string().required("Required"),
  voteTime: Yup.string().required("Required"),
  endTime: Yup.string().required("Required"),
  contestPromptTitle: Yup.string().required("Required"),
  contestPromptBody: Yup.string().required("Required"),
  submitterRestrictions: Yup.array().required("Required"),
  votingPolicy: Yup.array().required("Required"),
});

const initialState = {
  type: null,
  startTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
  voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
  endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",

  contestPromptTitle: "",
  contestPromptBody: "",
  media_blob: null,
  media_url: null,
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

  errors: {
    contestPromptTitle: null,
    contestPromptBody: null,
    media_url: null,
    subRewards: {
      duplicateRanks: [],
    },
    voterRewards: {
      duplicateRanks: [],
    },
  },
  /*
  submitterRewards: [],
  voterRewards: [],
  submitterRestrictions: [],
  voterRestrictions: [],
  votingPolicy: "",
  */
} as ContestBuilderProps;

const ContestForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      name: "Contest Type",
      component: <ContestType state={state} dispatch={dispatch} />,
      errors: state.errors.type,
    },
    {
      name: "Deadlines",
      component: <Deadlines state={state} dispatch={dispatch} />,
      errors:
        state.errors.startTime || state.errors.voteTime || state.errors.endTime,
    },
    {
      name: "Standard Prompt",
      component: <StandardPrompt state={state} dispatch={dispatch} />,
    },
    {
      name: "Submitter Rewards",
      component: (
        <SubmitterRewardsComponent state={state} dispatch={dispatch} />
      ),
      errors: state.errors.subRewards?.duplicateRanks?.length > 0,
    },
    {
      name: "Voter Rewards",
      component: <VoterRewardsComponent state={state} dispatch={dispatch} />,
      errors: state.errors.voterRewards?.duplicateRanks?.length > 0,
    },
    {
      name: "Restrictions",
      component: <SubmitterRestrictions state={state} dispatch={dispatch} />,
    },
    {
      name: "Voting Policy",
      component: <VotingPolicy state={state} dispatch={dispatch} />,
      errors: state.errors.votingPolicy,
    },
    {},
  ];

  const handleSubmit = async () => {
    const contest = {
      ...state,
    };
    console.log(contest);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const errors = validateStep(state, currentStep);

      console.log(errors);
      if (Object.keys(errors).length > 0)
        return dispatch({ type: "setErrors", payload: errors });

      //setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-11/12 text-white px-4 py-8 rounded-lg ml-auto mr-auto">
      <div className="flex w-full lg:w-1/5 items-start ">
        <ul className="steps steps-horizontal lg:steps-vertical">
          {steps.map((el, index) => {
            const isActive = currentStep === index;
            const isCompleted = index < currentStep;
            const hasErrors = steps[currentStep].errors;
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
                onClick={() => handleStepChange(index)}
              >
                {el.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col w-full lg:w-4/5 gap-8">
        <Formik<ContestBuilderProps>
          initialValues={state}
          validationSchema={ContestSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="px-4 py-6  shadow rounded-lg">
              {steps.map((el, index) => {
                return (
                  <div
                    key={index}
                    className={`${index !== currentStep ? "hidden" : ""}`}
                  >
                    {el.component}
                  </div>
                );
              })}

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
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContestForm;
