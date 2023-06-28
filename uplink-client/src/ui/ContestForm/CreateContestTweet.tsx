"use client";
import { ContestBuilderProps } from "@/lib/contestHandler";
import { BlockWrapper } from "./ContestForm";
import TwitterConnectButton from "../TwitterConnectButton/TwitterConnectButton";
import CreateThread from "../CreateThread/CreateThread";
import { nanoid } from "nanoid";

// at this stage, the contest is locked in.
// we can assume that the tweet thread is not empty and it has been inferred from the contest setttings

const CreateContestTweet = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Contest Dates" info="Select dates & times">
      <p>hello</p>

      <CreateThread
        initialThread={state.tweetThread}
        confirmLabel="save thread"
        onConfirm={(thread) => {
          dispatch({ type: "setTweetThread", payload: thread });
        }}
      />
    </BlockWrapper>
  );
};

export default CreateContestTweet;
