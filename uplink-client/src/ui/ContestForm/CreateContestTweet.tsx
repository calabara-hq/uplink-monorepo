import { ContestBuilderProps } from "@/lib/contestHandler";
import { BlockWrapper } from "./ContestForm";
import TwitterConnectButton from "../TwitterConnectButton/TwitterConnectButton";

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
      <TwitterConnectButton />
    </BlockWrapper>
  );
};

export default CreateContestTweet;
