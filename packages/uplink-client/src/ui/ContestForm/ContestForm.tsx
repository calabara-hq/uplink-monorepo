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
} from "@/app/contestbuilder/contestHandler";
import StandardPrompt from "./StandardPrompt";
import Deadlines from "./Deadlines";
import ContestType from "./ContestType";
import SubmitterRewardsComponent from "./SubmitterRewards";
import VoterRewardsComponent from "./VoterRewards";
import SubmitterRestrictions from "./SubmitterRestrictions";
import VotingPolicy from "./VotingPolicy";
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

const initialState = {
  type: null,
  startTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
  voteTime: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, -5) + "Z",
  endTime: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, -5) + "Z",
  errors: {
    type: null,
    startTime: null,
    voteTime: null,
    endTime: null,
  },
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
  submitterRewards: {
    payouts: [
      {
        rank: 1,
      },
    ],
  },
  voterRewards: {
    payouts: [
      {
        rank: 1,
      },
    ],
  },
  submitterRestrictions: [],
  votingPolicy: [],
  /*
  submitterRewards: [],
  voterRewards: [],
  submitterRestrictions: [],
  voterRestrictions: [],
  votingPolicy: "",
  */
} as ContestBuilderProps;

export default function ContestForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(["Choose a template", "Dates"]);

  const handleSave = async () => {
    const contest = {
      ...state,
    };
    console.log(contest);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-11/12 text-white px-4 py-8 rounded-lg ml-auto mr-auto">
      <div className="flex w-full lg:w-1/5 items-start ">
        <ul className="steps steps-horizontal lg:steps-vertical">
          {steps.map((el, index) => {
            return (
              <li
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`step text-sm cursor-pointer ${
                  index <= currentStep ? "step-primary" : ""
                }`}
              >
                {el}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col w-full lg:w-4/5 gap-2">
        <ContestType type={state.type} dispatch={dispatch} />
        {state.type && <Deadlines state={state} dispatch={dispatch} />}
        <StandardPrompt state={state} dispatch={dispatch} />
        <SubmitterRewardsComponent state={state} dispatch={dispatch} />
        <VoterRewardsComponent state={state} dispatch={dispatch} />
        <SubmitterRestrictions state={state} dispatch={dispatch} />
        <VotingPolicy state={state} dispatch={dispatch} />
        {/*<TweetThread state={state} dispatch={dispatch} />*/}
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        save
      </button>
    </div>
  );
}

/**
 * first tweet should be the title + cover image and rewards
 * 2nd tweet should be instructions
 */

const TweetThread = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Tweet">
      <div className="flex flex-col w-full lg:flex-row"></div>
    </BlockWrapper>
  );
};
