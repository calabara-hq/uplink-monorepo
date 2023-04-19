import {
  ArcadeStrategy,
  arraysSubtract,
  ContestBuilderProps,
  VotingPolicyType,
  WeightedStrategy,
} from "@/app/contestbuilder/contestHandler";
import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./ContestForm";
import { IToken } from "@/types/token";
import { SubmitterRestriction } from "@/app/contestbuilder/contestHandler";
import { useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";

const VotingPolicy = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);

  return (
    <BlockWrapper title="Voting Policy">
      <div className="flex flex-col w-full gap-2">
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
                    <td className="text-center">{policy?.token?.symbol}</td>
                    <td className="text-center">{policy?.strategy?.type}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          dispatch({
                            type: "removeVotingPolicy",
                            payload: index,
                          });
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal
          isModalOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
        >
          <VotingPolicyManager
            isModalOpen={isTokenModalOpen}
            setIsModalOpen={setIsTokenModalOpen}
            state={state}
            dispatch={dispatch}
          />
        </Modal>
        <button
          className="btn btn-sm"
          onClick={() => {
            setIsTokenModalOpen(true);
          }}
        >
          Add Policy
        </button>
      </div>
    </BlockWrapper>
  );
};

const initialPolicyState: VotingPolicyType = {};

type PolicyAction =
  | { type: "setToken"; payload: { token: IToken } }
  | {
      type: "setStrategy";
      payload: { strategy: ArcadeStrategy | WeightedStrategy };
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
    case "setStrategy":
      return {
        ...state,
        strategy: action.payload.strategy,
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
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPolicy, setCurrentPolicy] = useReducer(
    policyReducer,
    initialPolicyState
  );

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
            dispatch({ type: "addVotingPolicy", payload: currentPolicy });
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
  const [threshold, setThreshold] = useState<number>(0);

  const handleStrategyChange = (strategyType: string) => {
    setCurrentPolicy({
      type: "setStrategy",
      payload: {
        strategy:
          strategyType === "arcade"
            ? { type: "arcade", votingPower: "0" }
            : { type: "weighted", multiplier: "0" },
      },
    });
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThreshold(parseInt(e.target.value));
    setCurrentPolicy({
      type: "setStrategyParameter",
      payload: { value: e.target.value },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">Strategy</label>
        <div className="flex gap-2">
          <button
            className={`${
              currentPolicy?.strategy?.type === "arcade"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md`}
            onClick={() => handleStrategyChange("arcade")}
          >
            Arcade
          </button>
          <button
            className={`${
              currentPolicy?.strategy?.type === "weighted"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md`}
            onClick={() => handleStrategyChange("weighted")}
          >
            Weighted
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">Threshold</label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="number"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </div>
    </div>
  );
};

export default VotingPolicy;
