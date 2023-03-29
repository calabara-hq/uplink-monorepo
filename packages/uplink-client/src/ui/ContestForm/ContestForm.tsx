"use client";
import { useReducer, useState, useEffect } from "react";
import {
  ContestBuilderProps,
  reducer,
} from "@/app/contestbuilder/contestHandler";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import DateTimeSelector from "../DateTime/DateTime";

const initialState = {
  startTime: new Date(Date.now()).toISOString().slice(0, -5) + "Z",
  voteTime:
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, -5) +
    "Z",
  endTime:
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, -5) +
    "Z",
  errors: {
    startTime: null,
    voteTime: null,
    endTime: null,
  },
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

export default function ContestForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div className="flex w-full bg-black text-white px-2 py-2 rounded-lg justify-center items-center ml-auto mr-auto">
      <div className=" flex flex-col gap-2 w-full">
        <DateTimes state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

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
    <div>
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
    </div>
  );
};

const Prompt = () => {};

const Rewards = () => {};
