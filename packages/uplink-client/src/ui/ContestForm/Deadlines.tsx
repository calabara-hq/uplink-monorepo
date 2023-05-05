import { ContestBuilderProps } from "@/app/contestbuilder/contestHandler";
import DateTimeSelector from "../DateTime/DateTime";
import { BlockWrapper } from "./ContestForm";
const Deadlines = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const { deadlines, errors } = state;
  const { startTime, voteTime, endTime } = deadlines;

  return (
    <BlockWrapper title="Contest Dates">
      <DateTimeSelector
        isoString={startTime}
        label="start"
        error={errors?.deadlines?.startTime}
        callback={(isoString) => {
          dispatch({ type: "setStartTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={voteTime}
        label="vote"
        error={errors?.deadlines?.voteTime}
        callback={(isoString) => {
          dispatch({ type: "setVoteTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={endTime}
        label="end"
        error={errors?.deadlines?.endTime}
        callback={(isoString) => {
          dispatch({ type: "setEndTime", payload: isoString });
        }}
      />
    </BlockWrapper>
  );
};

export default Deadlines;
