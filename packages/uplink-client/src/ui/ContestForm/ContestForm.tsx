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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import DateTimeSelector from "../DateTime/DateTime";
import { createReactEditorJS } from "react-editor-js";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import StandardPrompt from "./StandardPrompt";
import Deadlines from "./Deadlines";
import ContestType from "./ContestType";
import TokenModal from "../TokenModal/TokenModal";
import { IToken } from "@/types/token";
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
  submitterRewardOptions: [
    {
      type: "ETH",
      symbol: "ETH",
      decimals: 18,
      selected: false,
    },
  ],
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
    console.log(contest.submitterRewardOptions);
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
        <SubmitterRewards state={state} dispatch={dispatch} />
        {/*<TweetThread state={state} dispatch={dispatch} />*/}
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        save
      </button>
    </div>
  );
}

/**
 * submitter rewards should first allow the user to select from a list of space tokens or add new ones
 * after choosing the proper tokens, the user should be able to select the amount of tokens to be distributed to each rank
 * the user must choose at least 1 token to be distributed to each rank (eth, erc20, erc721, erc1155)
 * more than 1 token can be distributed to each rank, but not more than 1 token type
 */

const SubmitterRewards = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSaveCallback = (data: IToken, actionType: "add" | "swap") => {
    if (actionType === "add")
      return dispatch({ type: "addSubmitterRewardOption", payload: data });
    else if (actionType === "swap")
      return dispatch({ type: "swapSubmitterRewardOption", payload: data });
  };
  return (
    <BlockWrapper title="Submitter Rewards">
      <div className="flex flex-col w-full gap-2">
        {state.submitterRewardOptions.map((token, index) => {
          return <TokenCard key={index} token={token} dispatch={dispatch} />;
        })}
      </div>
      <button className="btn" onClick={() => setIsModalOpen(true)}>
        add reward
      </button>
      <TokenModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        callback={handleSaveCallback}
        existingTokens={state.submitterRewardOptions}
        strictStandard={true}
      />
    </BlockWrapper>
  );
};

const TokenCard = ({
  token,
  dispatch,
}: {
  token: IToken;
  dispatch: React.Dispatch<any>;
}) => {
  const onSelectCallback = (isSelected: boolean) => {
    dispatch({
      type: "toggleSubmitterRewardOption",
      payload: { type: token.type, selected: isSelected },
    });
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{token.symbol}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <Toggle defaultState={false} onSelectCallback={onSelectCallback} />
        </div>
      </div>
    </div>
  );
};

const Toggle = ({
  defaultState,
  onSelectCallback,
}: {
  defaultState: boolean;
  onSelectCallback: (isSelected: boolean) => void;
}) => {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectCallback(e.target.checked);
  };
  return (
    <input
      type="checkbox"
      className="toggle toggle-accent border-2"
      defaultChecked={defaultState}
      onChange={handleToggle}
    />
  );
};

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
