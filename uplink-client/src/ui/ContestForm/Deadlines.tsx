import { ContestBuilderProps } from "@/lib/contestHandler";
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
  const { snapshot, startTime, voteTime, endTime } = deadlines;


  return (
    <BlockWrapper title="Contest Dates" info="Select dates & times">
      <DateTimeSelector
        isoString={startTime !== 'now' ? startTime.slice(0, -5) + "Z": startTime}
        label="start"
        error={errors?.deadlines?.startTime}
        callback={(isoString) => {
          dispatch({ type: "setStartTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={voteTime !== 'now' ? voteTime.slice(0, -5) + "Z": voteTime}
        label="vote"
        error={errors?.deadlines?.voteTime}
        callback={(isoString) => {
          console.log(isoString)
          dispatch({ type: "setVoteTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={endTime !== 'now' ? endTime.slice(0, -5) + "Z": endTime}
        label="end"
        error={errors?.deadlines?.endTime}
        callback={(isoString) => {
          dispatch({ type: "setEndTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={snapshot !== 'now' ? snapshot.slice(0, -5) + "Z": snapshot}
        label="snapshot"
        error={errors?.deadlines?.snapshot}
        callback={(isoString) => {
          dispatch({ type: "setSnapshot", payload: isoString });
        }}
      />
    </BlockWrapper>
  );
};

export default Deadlines;
