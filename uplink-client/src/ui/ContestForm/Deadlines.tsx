import DateTimeSelector from "../DateTime/DateTime";
import { BlockWrapper } from "./Entrypoint";
import { useState } from "react";
import {
  validateDeadlines,
  ContestBuilderProps,
  DeadlineError,
} from "./contestHandler";

const Deadlines = ({
  initialDeadlines,
  handleConfirm,
  errors,
  setErrors,
}: {
  initialDeadlines: ContestBuilderProps["deadlines"];
  handleConfirm: (deadlines: ContestBuilderProps["deadlines"]) => void;
  errors: DeadlineError;
  setErrors: (errors: DeadlineError) => void;
}) => {
  const [deadlines, setDeadlines] = useState(initialDeadlines);

  const { startTime, voteTime, endTime, snapshot } = deadlines;

  const handleTimeChange = (
    field: "startTime" | "voteTime" | "endTime" | "snapshot",
    isoString: string
  ) => {
    setDeadlines({ ...deadlines, [field]: isoString });
    setErrors({ ...errors, [field]: "" });
  };

  const onSubmit = () => {
    const { errors, isError, data } = validateDeadlines(deadlines, false);
    if (isError) return setErrors(errors);
    handleConfirm(data);
  };
  return (
    <BlockWrapper title="Deadlines">
      <DateTimeSelector
        isoString={
          startTime !== "now" ? startTime.slice(0, -5) + "Z" : startTime
        }
        label="start"
        error={errors.startTime}
        callback={(isoString) => {
          handleTimeChange("startTime", isoString);
        }}
      />
      <DateTimeSelector
        isoString={voteTime !== "now" ? voteTime.slice(0, -5) + "Z" : voteTime}
        label="vote"
        error={errors.voteTime}
        callback={(isoString) => {
          handleTimeChange("voteTime", isoString);
        }}
      />
      <DateTimeSelector
        isoString={endTime !== "now" ? endTime.slice(0, -5) + "Z" : endTime}
        label="end"
        error={errors.endTime}
        callback={(isoString) => {
          handleTimeChange("endTime", isoString);
        }}
      />
      <DateTimeSelector
        isoString={snapshot !== "now" ? snapshot.slice(0, -5) + "Z" : snapshot}
        label="snapshot"
        error={errors.snapshot}
        callback={(isoString) => {
          handleTimeChange("snapshot", isoString);
        }}
      />
      <button
        onClick={onSubmit}
        className="btn btn-primary normal-case mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

export default Deadlines;
