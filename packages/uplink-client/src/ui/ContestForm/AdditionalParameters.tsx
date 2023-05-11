import { ContestBuilderProps } from "@/lib/contestHandler";
import { BlockWrapper } from "./ContestForm";

const AdditionalParameters = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Additional Parameters" info="Toggle Additional Params">
      <div className="flex flex-col w-full mt-2 gap-8">
        <AnonymousSubmissions
          anonSubs={state.additionalParams.anonSubs}
          dispatch={dispatch}
        />
        <VisibleVotes
          visibleVotes={state.additionalParams.visibleVotes}
          dispatch={dispatch}
        />
        <SelfVotes
          selfVote={state.additionalParams.selfVote}
          dispatch={dispatch}
        />
        <SubmissionLimit
          subLimit={state.additionalParams.subLimit}
          dispatch={dispatch}
        />
      </div>
    </BlockWrapper>
  );
};

const AnonymousSubmissions = ({
  anonSubs,
  dispatch,
}: {
  anonSubs: boolean;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex flex-col w-full ">
        <p className="text-lg font-bold ">Anon Subs</p>
        <p className="text-sm text-accent-content ml-2">
          Should contest results be visible during voting?
        </p>
      </div>

      <div className="ml-auto">
        <Toggle
          defaultState={anonSubs}
          onSelectCallback={(value) => {
            dispatch({ type: "setAnonSubs", payload: value });
          }}
        />
      </div>
    </div>
  );
};

const VisibleVotes = ({
  visibleVotes,
  dispatch,
}: {
  visibleVotes: boolean;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex flex-col w-full ">
        <p className="text-lg font-bold ">Visible Votes</p>
        <p className="text-sm text-accent-content ml-2">
          Should contest results be visible during voting?
        </p>
      </div>
      <div className="ml-auto">
        <Toggle
          defaultState={visibleVotes}
          onSelectCallback={(value) => {
            dispatch({ type: "setVisibleVotes", payload: value });
          }}
        />
      </div>
    </div>
  );
};

const SelfVotes = ({
  selfVote,
  dispatch,
}: {
  selfVote: boolean;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex flex-col w-full ">
        <p className="text-lg font-bold ">Self Votes</p>
        <p className="text-sm text-accent-content ml-2">
          Are participants able to vote on their own submissions?
        </p>
      </div>

      <div className="ml-auto">
        <Toggle
          defaultState={selfVote}
          onSelectCallback={(value) => {
            dispatch({ type: "setSelfVote", payload: value });
          }}
        />
      </div>
    </div>
  );
};

const SubmissionLimit = ({
  subLimit,
  dispatch,
}: {
  subLimit: number;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-2">
      <p className="text-lg font-bold">Submission Limit</p>
      <div className="lg:ml-auto flex gap-2">
        <button
          onClick={() => {
            dispatch({ type: "setSubLimit", payload: 1 });
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 1
              ? "border-success border-2 shadow-box hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          1
        </button>
        <button
          onClick={() => {
            dispatch({ type: "setSubLimit", payload: 2 });
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 2
              ? "border-success border-2 shadow-box hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          2
        </button>
        <button
          onClick={() => {
            dispatch({ type: "setSubLimit", payload: 3 });
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 3
              ? "border-success border-2 shadow-box hover:border-success hover:bg-transparent"
              : ""
          }`}
        >
          3
        </button>
        <button
          onClick={() => {
            dispatch({ type: "setSubLimit", payload: 0 });
          }}
          className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
            subLimit === 0
              ? "border-success border-2 shadow-box hover:border-success hover:bg-transparent"
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

export default AdditionalParameters;
