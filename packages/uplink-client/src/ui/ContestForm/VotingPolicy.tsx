import {
  ArcadeStrategy,
  arraysSubtract,
  ContestBuilderProps,
  VotingPolicyType,
} from "@/app/contestbuilder/contestHandler";
import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./ContestForm";
import { IToken } from "@/types/token";
import { SubmitterRestriction } from "@/app/contestbuilder/contestHandler";
import { useEffect, useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";

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

  useEffect(() => {
    console.log("votingPolicy", state.votingPolicy);
  }, [state.votingPolicy]);

  return (
    <BlockWrapper title="Voting Policy">
      <div className="flex flex-col w-full gap-2">
        {state.errors.votingPolicy && (
          <p className="text-red-500">{state.errors.votingPolicy}</p>
        )}
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
                    <td className="text-center">
                      <p>{policy?.strategy?.type}</p>
                      <p>
                        {policy?.strategy?.type === "arcade" &&
                          policy?.strategy?.votingPower}
                      </p>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleEditStrategy(index)}
                      >
                        edit
                      </button>
                    </td>
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

  const [strategyToken, setStrategyToken] = useState<IToken | null>(
    isEdit ? state.votingPolicy[editIndex]?.token ?? null : null
  );

  const [selectedStrategy, setSelectedStrategy] = useState<
    "arcade" | "weighted" | null
  >(isEdit ? state.votingPolicy[editIndex].strategy?.type || null : null);

  const [votingPower, setVotingPower] = useState<string>(
    isEdit && selectedStrategy === "arcade"
      ? (state.votingPolicy[editIndex]?.strategy as ArcadeStrategy)
          ?.votingPower ?? ""
      : ""
  );

  const [progress, setProgress] = useState(isEdit ? 1 : 0);

  const saveTokenCallback = (token: IToken) => {
    setStrategyToken(token);
    setProgress(1);
  };

  const handleSubmitStrategy = () => {
    const policy = {
      token: strategyToken,
      strategy: {
        type: selectedStrategy,
        ...(selectedStrategy === "arcade" ? { votingPower: votingPower } : {}),
      },
    };

    if (isEdit) {
      dispatch({
        type: "updateVotingPolicy",
        payload: { index: editIndex, policy: policy },
      });
    } else {
      dispatch({
        type: "addVotingPolicy",
        payload: { policy: policy },
      });
    }
    setIsModalOpen(false);
  };

  if (progress === 0)
    return (
      <TokenManager
        setIsModalOpen={setIsModalOpen}
        saveCallback={saveTokenCallback}
        existingTokens={state.votingPolicy.map(
          (policy) => policy.token as IToken
        )}
        quickAddTokens={arraysSubtract(
          state.spaceTokens,
          state.votingPolicy.map((policy) => policy.token as IToken)
        )}
        continuous={true}
        uniqueStandard={false}
      />
    );

  if (progress === 1)
    return (
      <>
        <StrategyManager
          selectedStrategy={selectedStrategy}
          setSelectedStrategy={setSelectedStrategy}
          votingPower={votingPower}
          setVotingPower={setVotingPower}
        />
        <ModalActions
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleSubmitStrategy}
          confirmLabel="confirm"
          confirmDisabled={selectedStrategy === "arcade" ? !votingPower : false}
        />
      </>
    );

  return null;
};

const StrategyManager = ({
  selectedStrategy,
  setSelectedStrategy,
  votingPower,
  setVotingPower,
}: {
  selectedStrategy: "arcade" | "weighted" | null;
  setSelectedStrategy: any;
  votingPower: string;
  setVotingPower: any;
}) => {
  const handleStrategyChange = (strategyType: string) => {
    setSelectedStrategy(strategyType);
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md">
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">Strategy</label>
        <div className="flex gap-2">
          <button
            className={`${
              selectedStrategy === "arcade"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md`}
            onClick={() => handleStrategyChange("arcade")}
          >
            Arcade
          </button>
          <button
            className={`${
              selectedStrategy === "weighted"
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
        <StrategyParameterInput
          votingPower={votingPower}
          setVotingPower={setVotingPower}
          selectedStrategy={selectedStrategy}
        />
      </div>
    </div>
  );
};

const StrategyParameterInput = ({
  votingPower,
  setVotingPower,
  selectedStrategy,
}: {
  votingPower: string;
  setVotingPower: any;
  selectedStrategy: "arcade" | "weighted" | null;
}) => {
  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotingPower(e.target.value);
  };

  if (selectedStrategy === "arcade") {
    return (
      <>
        <label className="text-gray-700 font-medium">voting power</label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="number"
          value={votingPower || ""}
          onChange={handleParameterChange}
        />
      </>
    );
  }

  return null;
};

export default VotingPolicy;
