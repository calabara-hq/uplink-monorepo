import {
  arraysSubtract,
  ContestBuilderProps,
  VotingPolicyType,
} from "@/app/contestbuilder/contestHandler";
import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./ContestForm";
import { IToken } from "@/types/token";
import { SubmitterRestriction } from "@/app/contestbuilder/contestHandler";
import { useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";
import TokenBadge from "../TokenBadge/TokenBadge";
import { TrashIcon, SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const VotingPolicy = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEditStrategy = (index: number) => {
    setEditIndex(index);
    setIsTokenModalOpen(true);
  };

  return (
    <BlockWrapper title="Voting Policy">
      <div className="alert bg-neutral border-2 border-[#3ABFF8] p-2 w-fit shadow-lg">
        <div className="flex flex-row gap-2">
          <SparklesIcon className="w-6 h-6" />
          <span>
            Voting credits determine how voting power is calculated, as well as
            any restrictions on voting power.
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-4">
        <button
          className="btn"
          onClick={() => {
            setIsTokenModalOpen(true);
          }}
        >
          Add Policy
        </button>

        {state.votingPolicy.length > 0 && (
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-center">Token</th>
                  <th className="text-center">Strategy</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody className="w-full">
                {state.votingPolicy.map((policy, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">
                        <p>{policy?.token?.symbol}</p>
                        <TokenBadge token={policy?.token} />
                      </td>
                      <td className="text-center">
                        <p className="font-bold badge badge-lg">
                          {policy?.strategy?.type}
                        </p>
                        <p>
                          {policy?.strategy?.type === "arcade"
                            ? policy?.strategy?.votingPower
                            : policy?.strategy?.multiplier}{" "}
                        </p>
                        <button
                          className="btn btn-sm btn-ghost link"
                          onClick={() => handleEditStrategy(index)}
                        >
                          edit
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => {
                            dispatch({
                              type: "removeVotingPolicy",
                              payload: index,
                            });
                          }}
                        >
                          Remove
                          <TrashIcon className="w-5 ml-2" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Modal
          isModalOpen={isTokenModalOpen}
          onClose={() => {
            setIsTokenModalOpen(false);
            setEditIndex(null);
          }}
        >
          <VotingPolicyManager
            isModalOpen={isTokenModalOpen}
            setIsModalOpen={setIsTokenModalOpen}
            editIndex={editIndex}
            state={state}
            dispatch={dispatch}
          />
        </Modal>
      </div>
    </BlockWrapper>
  );
};

const initialPolicyState: VotingPolicyType = {};

type PolicyAction =
  | { type: "setToken"; payload: { token: IToken } }
  | {
      type: "setStrategyType";
      payload: { strategyType: "arcade" | "weighted" };
    }
  | { type: "setStrategyParameter"; payload: { value: string } };

const policyReducer = (
  state: VotingPolicyType,
  action: PolicyAction
): VotingPolicyType => {
  switch (action.type) {
    case "setToken":
      return {
        ...state,
        token: action.payload.token,
      };
    case "setStrategyType":
      if (state.strategy?.type === action.payload.strategyType) {
        return state;
      }
      return {
        ...state,
        strategy: {
          type: action.payload.strategyType,
          ...(action.payload.strategyType === "arcade"
            ? { votingPower: state.strategy?.multiplier || "" }
            : { multiplier: state.strategy?.votingPower || "" }),
        },
      };
    case "setStrategyParameter":
      if (state.strategy) {
        return {
          ...state,
          strategy: {
            ...state.strategy,
            ...(state.strategy.type === "arcade"
              ? { votingPower: action.payload.value }
              : { multiplier: action.payload.value }),
          },
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

// extend the token manager with policy specific options

const VotingPolicyManager = ({
  isModalOpen,
  setIsModalOpen,
  state,
  dispatch,
  editIndex,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
  editIndex: number | null;
}) => {
  const isEdit = typeof editIndex === "number";

  const [currentPolicy, setCurrentPolicy] = useReducer(
    policyReducer,
    isEdit ? state.votingPolicy[editIndex] : initialPolicyState
  );
  const [progress, setProgress] = useState(isEdit ? 1 : 0);

  const saveTokenCallback = (token: IToken) => {
    setCurrentPolicy({
      type: "setToken",
      payload: { token: token },
    });
    setProgress(1);
  };

  if (progress === 0)
    return (
      <TokenManager
        setIsModalOpen={setIsModalOpen}
        saveCallback={saveTokenCallback}
        existingTokens={null}
        quickAddTokens={state.spaceTokens}
        continuous={true}
        uniqueStandard={false}
      />
    );

  if (progress === 1)
    return (
      <>
        <StrategyManager
          currentPolicy={currentPolicy}
          setCurrentPolicy={setCurrentPolicy}
        />
        <ModalActions
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            isEdit
              ? dispatch({
                  type: "updateVotingPolicy",
                  payload: {
                    policy: currentPolicy,
                    index: editIndex,
                  },
                })
              : dispatch({
                  type: "addVotingPolicy",
                  payload: {
                    policy: currentPolicy,
                  },
                });
            setIsModalOpen(false);
          }}
          confirmLabel="confirm"
        />
      </>
    );

  return null;
};

const StrategyManager = ({
  currentPolicy,
  setCurrentPolicy,
}: {
  currentPolicy: VotingPolicyType;
  setCurrentPolicy: React.Dispatch<any>;
}) => {
  const handleStrategyChange = (strategyType: string) => {
    setCurrentPolicy({
      type: "setStrategyType",
      payload: {
        strategyType: strategyType === "arcade" ? "arcade" : "weighted",
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-medium">Strategy</label>
        <div className="flex justify-around items-center">
          <button
            className={`${
              currentPolicy?.strategy?.type === "arcade"
                ? "btn btn-lg btn-active btn-accent"
                : "btn btn-lg btn-outline"
            } px-4 py-2 rounded-md`}
            onClick={() => handleStrategyChange("arcade")}
          >
            Arcade
          </button>
          <div className="divider lg:divider-horizontal">
            <ArrowPathIcon className="w-24" />
          </div>

          <button
            className={`${
              currentPolicy?.strategy?.type === "weighted"
                ? "btn btn-lg btn-active btn-accent"
                : "btn btn-lg btn-outline"
            } px-4 py-2 rounded-md`}
            onClick={() => handleStrategyChange("weighted")}
          >
            Weighted
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <StrategyParameterInput
          currentPolicy={currentPolicy}
          setCurrentPolicy={setCurrentPolicy}
        />
      </div>
    </div>
  );
};

const StrategyParameterInput = ({
  currentPolicy,
  setCurrentPolicy,
}: {
  currentPolicy: VotingPolicyType;
  setCurrentPolicy: React.Dispatch<any>;
}) => {
  console.log(currentPolicy);
  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPolicy({
      type: "setStrategyParameter",
      payload: { value: e.target.value },
    });
  };

  if (currentPolicy?.strategy?.type === "arcade") {
    return (
      <>
        <label className="font-medium ">Voting Power</label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="number"
          value={currentPolicy?.strategy?.votingPower || ""}
          onChange={handleParameterChange}
        />
        <p>Defines a uniform numbers of credits alloted to each participant</p>
      </>
    );
  }
  if (currentPolicy?.strategy?.type === "weighted") {
    return (
      <>
        <label className="font-medium">Multiplier</label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="number"
          value={currentPolicy?.strategy?.multiplier || ""}
          onChange={handleParameterChange}
        />
        <p>Voting credits are based on ETH or ERC-20 holdings.</p>
      </>
    );
  }
  return null;
};

export default VotingPolicy;
