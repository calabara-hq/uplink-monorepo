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
import TokenBadge from "../TokenBadge/TokenBadge";
import InfoAlert from "../InfoAlert/InfoAlert";
import {
  TrashIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

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
      <InfoAlert>
        <p>
          Voting credits determine how voting power is calculated, as well as
          any restrictions on voting power.
        </p>
      </InfoAlert>
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
                          {policy?.strategy?.type === "arcade" &&
                            policy?.strategy?.votingPower}
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xl font-medium">Strategy</label>
        <div className="flex justify-around items-center bg-base-100 rounded-lg">
          <button
            className={`${
              selectedStrategy === "arcade"
                ? "btn btn-lg btn-active btn-accent"
                : "btn btn-lg btn-outline"
            } px-4 py-2 rounded-md`}
            onClick={() => handleStrategyChange("arcade")}
          >
            Arcade
          </button>
          <div className="divider lg:divider-horizontal text-primary-content">
            <ArrowPathIcon className="w-24" />
          </div>

          <button
            className={`${
              selectedStrategy === "weighted"
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
        <label className="font-medium ">Voting Power</label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="number"
          value={votingPower || ""}
          onChange={handleParameterChange}
        />
        <p>Voting credits are based on ETH or ERC-20 holdings.</p>
      </>
    );
  }

  return null;
};

export default VotingPolicy;
