import { ContestBuilderProps } from "@/app/contestbuilder/contestHandler";
import { useEffect } from "react";
import DateTimeSelector from "../DateTime/DateTime";
import { BlockWrapper } from "./ContestForm";
const Deadlines = ({
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

    if (voteTime <= startTime) {
      dispatch({
        type: "setErrors",
        payload: { voteTime: "vote date must be after start date" },
      });
    }
    if (endTime <= voteTime) {
      dispatch({
        type: "setErrors",
        payload: { endTime: "end date must be after vote date" },
      });
    }
    if (endTime <= startTime) {
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
        error={errors?.startTime}
        callback={(isoString) => {
          dispatch({ type: "setStartTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={voteTime}
        label="vote"
        error={errors?.voteTime}
        callback={(isoString) => {
          dispatch({ type: "setVoteTime", payload: isoString });
        }}
      />
      <DateTimeSelector
        isoString={endTime}
        label="end"
        error={errors?.endTime}
        callback={(isoString) => {
          dispatch({ type: "setEndTime", payload: isoString });
        }}
      />
    </BlockWrapper>
  );
};

export default Deadlines;
