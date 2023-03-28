"use client";
import { useReducer, useState } from "react";
import { reducer } from "@/app/contestbuilder/contestHandler";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import DateTimeSelector from "../DateTime/DateTime";

const initialState = {
  startTime: new Date().toISOString(),
  voteTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  /*
  submitterRewards: [],
  voterRewards: [],
  submitterRestrictions: [],
  voterRestrictions: [],
  contestPromptTitle: "",
  contestPromptBody: "",
  votingPolicy: "",
  */
};

export default function ContestForm() {
  return (
    <div className="flex w-full bg-black/30 text-white px-2 py-2 rounded-lg justify-center items-center ml-auto mr-auto">
      <div className=" flex flex-col gap-2 w-full">
        <DateTimes />
      </div>
    </div>
  );
}

const DateTimes = () => {
  return <DateTimeSelector />;
};

const Prompt = () => {};

const Rewards = () => {};
