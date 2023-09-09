"use client";
import { ContestBuilderProps } from "./contestHandler";
import { BlockWrapper } from "./Entrypoint";
import { useState } from "react";


const Extras = ({
  initialExtras,
  handleConfirm,
}: {
  initialExtras: ContestBuilderProps["additionalParams"];
  handleConfirm: (extras: ContestBuilderProps["additionalParams"]) => void;
}) => {
  const [additionalParams, setAdditionalParams] = useState(initialExtras);

  const onSubmit = () => {
    handleConfirm(additionalParams);
  };

  return (
    <BlockWrapper title="Additional Parameters">
      <div className="flex flex-col w-full mt-2 gap-8">
        <AnonymousSubmissions
          anonSubs={additionalParams.anonSubs}
          setAdditionalParams={setAdditionalParams}
        />
        <VisibleVotes
          visibleVotes={additionalParams.visibleVotes}
          setAdditionalParams={setAdditionalParams}
        />
        <SelfVotes
          selfVote={additionalParams.selfVote}
          setAdditionalParams={setAdditionalParams}
        />
        <SubmissionLimit
          subLimit={additionalParams.subLimit}
          setAdditionalParams={setAdditionalParams}
        />
      </div>
      <button
        onClick={onSubmit}
        className="btn btn-primary normal-case mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

const AnonymousSubmissions = ({
  anonSubs,
  setAdditionalParams,
}: {
  anonSubs: boolean;
  setAdditionalParams: React.Dispatch<any>;
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex flex-col w-full ">
        <p className="text-lg font-bold ">Anon Subs</p>
        <p className="text-sm text-t2">
          Should submission authors be visible during voting?
        </p>
      </div>

      <div className="ml-auto">
        <Toggle
          defaultState={anonSubs}
          onSelectCallback={(value) => {
            setAdditionalParams((prev) => ({
              ...prev,
              anonSubs: value,
            }));
          }}
        />
      </div>
    </div>
  );
};

const VisibleVotes = ({
  visibleVotes,
  setAdditionalParams,
}: {
  visibleVotes: boolean;
  setAdditionalParams: React.Dispatch<any>;
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex flex-col w-full ">
        <p className="text-lg font-bold ">Visible Votes</p>
        <p className="text-sm text-t2">
          Should contest results be visible during voting?
        </p>
      </div>
      <div className="ml-auto">
        <Toggle
          defaultState={visibleVotes}
          onSelectCallback={(value) => {
            setAdditionalParams((prev) => ({
              ...prev,
              visibleVotes: value,
            }));
          }}
        />
      </div>
    </div>
  );
};

const SelfVotes = ({
  selfVote,
  setAdditionalParams,
}: {
  selfVote: boolean;
  setAdditionalParams: React.Dispatch<any>;
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex flex-col w-full ">
        <p className="text-lg font-bold ">Self Votes</p>
        <p className="text-sm text-t2">
          Are participants able to vote on their own submissions?
        </p>
      </div>

      <div className="ml-auto">
        <Toggle
          defaultState={selfVote}
          onSelectCallback={(value) => {
            setAdditionalParams((prev) => ({
              ...prev,
              selfVote: value,
            }));
          }}
        />
      </div>
    </div>
  );
};

const SubmissionLimit = ({
  subLimit,
  setAdditionalParams,
}: {
  subLimit: number;
  setAdditionalParams: React.Dispatch<any>;
}) => {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-2">
      <p className="text-lg font-bold">Submission Limit</p>
      <div className="lg:ml-auto flex gap-2">
        <button
          onClick={() => {
            setAdditionalParams((prev) => ({
              ...prev,
              subLimit: 1,
            }));
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 1
              ? "border-success border-2 hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          1
        </button>
        <button
          onClick={() => {
            setAdditionalParams((prev) => ({
              ...prev,
              subLimit: 2,
            }));
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 2
              ? "border-success border-2 hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          2
        </button>
        <button
          onClick={() => {
            setAdditionalParams((prev) => ({
              ...prev,
              subLimit: 3,
            }));
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 3
              ? "border-success border-2 hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          3
        </button>
        <button
          onClick={() => {
            setAdditionalParams((prev) => ({
              ...prev,
              subLimit: 0,
            }));
          }}
          className={`btn btn-ghost normal-case border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 0
              ? "border-success border-2 hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          unlimited
        </button>
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
      className="toggle toggle-success border-2"
      defaultChecked={defaultState}
      onChange={handleToggle}
    />
  );
};

export default Extras;
