"use client";
import { useReducer, useState, useEffect, useRef, useCallback } from "react";
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
import EDITOR_JS_TOOLS from "@/lib/editorTools";
import { ReactEditorJS } from "@react-editor-js/core";
import EditorJS from "@editorjs/editorjs";
import EditorWrap from "../EditorWrap/EditorWrap";
import MenuSelect, { Option } from "../MenuSelect/MenuSelect";

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
  /*
  submitterRewards: [],
  voterRewards: [],
  submitterRestrictions: [],
  voterRestrictions: [],
  contestPromptTitle: "",
  contestPromptBody: "",
  votingPolicy: "",
  */
} as ContestBuilderProps;

const labelOptions: Option[] = [
  { value: "art", label: "art" },
  { value: "design", label: "design" },
  { value: "misc", label: "misc" },
];

export default function ContestForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(["Choose a template", "Dates"]);
  const ReactEditorJS = createReactEditorJS();
  const editorCore = useRef<EditorJS | null>(null);

  const handleSave = async () => {
    const contest = {
      ...state,
      contestPromptBody: await editorCore.current?.save(),
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
        <Template type={state.type} dispatch={dispatch} />
        {state.type && <DateTimes state={state} dispatch={dispatch} />}
        <Prompt
          state={state}
          dispatch={dispatch}
          ReactEditorJS={ReactEditorJS}
          editorCore={editorCore}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        save
      </button>
    </div>
  );
}

const Prompt = ({
  state,
  dispatch,
  ReactEditorJS,
  editorCore,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
  ReactEditorJS: any;
  editorCore: any;
}) => {
  return (
    <BlockWrapper title="Contest Prompt">
      <div className="flex flex-col w-full lg:flex-row"></div>
      {state.type === "standard" && (
        <StandardPrompt
          state={state}
          dispatch={dispatch}
          ReactEditorJS={ReactEditorJS}
          editorCore={editorCore}
        />
      )}
    </BlockWrapper>
  );
};

const StandardPrompt = ({
  state,
  dispatch,
  ReactEditorJS,
  editorCore,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
  ReactEditorJS: any;
  editorCore: any;
}) => {
  const [selectedLabel, setSelectedLabel] = useState<Option>(labelOptions[0]);

  const handleInitialize = useCallback(async (instance: any) => {
    editorCore.current = instance;
  }, []);

  const callback = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full lg:w-2/3 gap-6">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col w-2/3">
            <label className="text-sm p-1">Title</label>
            <input
              className="input"
              type="text"
              value={state.contestPromptTitle}
              onChange={(e) =>
                dispatch({
                  type: "contestPromptTitle",
                  payload: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label className="text-sm p-1">Label</label>
            <MenuSelect
              options={labelOptions}
              selected={selectedLabel}
              setSelected={setSelectedLabel}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label className="text-sm p-1">Body</label>
          <EditorWrap>
            <ReactEditorJS
              defaultValue={null}
              ref={editorCore}
              onInitialize={handleInitialize}
              tools={EDITOR_JS_TOOLS}
            />
          </EditorWrap>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-1/2"></div>
    </div>
  );
};

const BlockWrapper = ({
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

const Template = ({
  type,
  dispatch,
}: {
  type: string | null;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Choose a template">
      <div className="flex flex-col w-full lg:flex-row">
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "standard" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-green-400" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "standard" });
            }}
            className={`btn h-full card bg-base-300 border-2 rounded-box place-items-center ${
              type === "standard" ? "border-green-400" : ""
            }`}
          >
            standard contest
          </button>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "twitter" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-blue-400" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "twitter" });
            }}
            className={`btn h-full card bg-base-300 border-2 rounded-box place-items-center ${
              type === "twitter" ? "border-blue-400" : ""
            }`}
          >
            twitter contest
          </button>
        </div>
      </div>
    </BlockWrapper>
  );
};

const DateTimes = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const { startTime, voteTime, endTime, errors } = state;
  useEffect(() => {
    // set errors if
    // voteTime < startTime || voteTime === startTime
    // endtime < voteTime || endTime === voteTime
    // endtime < startTime || endTime === startTime

    if (voteTime < startTime || voteTime === startTime) {
      dispatch({
        type: "setErrors",
        payload: { voteTime: "vote date must be after start date" },
      });
    }
    if (endTime < voteTime || endTime === voteTime) {
      dispatch({
        type: "setErrors",
        payload: { endTime: "end date must be after vote date" },
      });
    }
    if (endTime < startTime || endTime === startTime) {
      dispatch({
        type: "setErrors",
        payload: { endTime: "end date must be after start date" },
      });
    }
  }, [startTime, voteTime, endTime]);
  return (
    <BlockWrapper title="Contest Dates">
      <DateTimeSelector
        isoString={startTime}
        label="start"
        error={errors.startTime}
        callback={(isoString) => {
          dispatch({ type: "setStartTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={voteTime}
        label="vote"
        error={errors.voteTime}
        callback={(isoString) => {
          dispatch({ type: "setVoteTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={endTime}
        label="end"
        error={errors.endTime}
        callback={(isoString) => {
          dispatch({ type: "setEndTime", payload: isoString });
        }}
      />
    </BlockWrapper>
  );
};

const Rewards = () => {};
