import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./Entrypoint";
import { IToken } from "@/types/token";
import { useEffect, useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";
import TokenBadge from "../TokenBadge/TokenBadge";
import { HiTrash, HiArrowPath, HiPencil } from "react-icons/hi2";
import {
  validateVotingPolicy,
  ArcadeStrategy,
  arraysSubtract,
  ContestBuilderProps,
  VotingPolicyType,
} from "./contestHandler";
import TokenCard from "../TokenCard/TokenCard";
import { AiOutlinePlus } from "react-icons/ai";

const VotingPolicy = ({
  initialVotingPolicy,
  handleConfirm,
  spaceTokens,
  errors,
  setErrors,
}: {
  initialVotingPolicy: ContestBuilderProps["votingPolicy"];
  handleConfirm: (votingPolicy: ContestBuilderProps["votingPolicy"]) => void;
  spaceTokens: IToken[];
  errors: string;
  setErrors: (errors: string) => void;
}) => {
  const [votingPolicy, setVotingPolicy] = useState(initialVotingPolicy);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const handleEditStrategy = (index: number) => {
    setEditIndex(index);
    setIsTokenModalOpen(true);
  };

  const removeVotingPolicy = (index: number) => {
    setVotingPolicy(votingPolicy.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    const { errors, isError, data } = validateVotingPolicy(votingPolicy);
    console.log({ errors, isError, data });
    if (isError) return setErrors(errors);
    handleConfirm(data);
  };

  return (
    <BlockWrapper
      title="Voting Policy"
      info="Who can vote, and how much voting power do they have?"
    >
      <div className="flex flex-col items-center w-full gap-4">
        {errors && <p className="text-error self-start">{errors}</p>}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 sm gap-4">
          <div
            className="card btn bg-base-200 h-28"
            onClick={() => setIsTokenModalOpen(true)}
          >
            <div className="flex flex-row gap-2 items-center">
              <AiOutlinePlus className="w-6 h-6" />
              <p>add reward</p>
            </div>
          </div>
          {votingPolicy.map((policy, index) => {
            return (
              <TokenCard
                key={index}
                token={policy.token}
                handleRemove={() => removeVotingPolicy(index)}
                editCallback={() => handleEditStrategy(index)}
              >
                <p className="font-bold text-t1">
                  {policy?.strategy?.type === "arcade"
                    ? `credits: ${policy?.strategy?.votingPower}`
                    : "weighted"}
                </p>
              </TokenCard>
            );
          })}
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
            votingPolicy={votingPolicy}
            setVotingPolicy={setVotingPolicy}
            spaceTokens={spaceTokens}
            setErrors={setErrors}
          />
        </Modal>
      </div>
      <button
        onClick={onSubmit}
        className="btn btn-primary lowercase mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

// extend the token manager with policy specific options

const VotingPolicyManager = ({
  isModalOpen,
  setIsModalOpen,
  votingPolicy,
  setVotingPolicy,
  editIndex,
  spaceTokens,
  setErrors,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  votingPolicy: ContestBuilderProps["votingPolicy"];
  setVotingPolicy: (votingPolicy: ContestBuilderProps["votingPolicy"]) => void;
  editIndex: number | null;
  spaceTokens: IToken[];
  setErrors: (error: string) => void;
}) => {
  const isEdit = typeof editIndex === "number";

  const [strategyToken, setStrategyToken] = useState<IToken | null>(
    isEdit ? votingPolicy[editIndex]?.token ?? null : null
  );

  const [selectedStrategy, setSelectedStrategy] = useState<
    "arcade" | "weighted" | null
  >(isEdit ? votingPolicy[editIndex].strategy?.type || null : null);

  const [votingPower, setVotingPower] = useState<string>(
    isEdit && selectedStrategy === "arcade"
      ? (votingPolicy[editIndex]?.strategy as ArcadeStrategy)?.votingPower ?? ""
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
    } as VotingPolicyType;

    isEdit
      ? setVotingPolicy(
          votingPolicy.map((p, i) => (i === editIndex ? policy : p))
        )
      : setVotingPolicy([...votingPolicy, policy]);
    setErrors("");
    setIsModalOpen(false);
  };

  if (progress === 0)
    return (
      <TokenManager
        setIsModalOpen={setIsModalOpen}
        saveCallback={saveTokenCallback}
        existingTokens={votingPolicy.map((policy) => policy.token as IToken)}
        quickAddTokens={arraysSubtract(
          spaceTokens,
          votingPolicy.map((policy) => policy.token as IToken)
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
          cancelLabel="Cancel"
          confirmDisabled={
            selectedStrategy === "arcade"
              ? !votingPower || !(parseInt(votingPower) > 0)
              : false
          }
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
      <div className="flex flex-col gap-6">
        <label className="text-xl font-medium">Strategy</label>
        <div className="flex justify-around items-center">
          <div className="flex flex-col gap-4 w-1/2">
            <button
              className={`${
                selectedStrategy === "arcade"
                  ? "btn btn-sm md:btn-md lg:btn-lg btn-active btn-success"
                  : "btn btn-sm md:btn-md lg:btn-lg btn-outline"
              } px-4 py-2 rounded-md`}
              onClick={() => handleStrategyChange("arcade")}
            >
              Arcade
            </button>
            <p className="text-t2">
              Configure a uniform voting power for all token holders.
            </p>
          </div>
          <div className="divider lg:divider-horizontal">
            <HiArrowPath className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4 w-1/2">
            <button
              className={`${
                selectedStrategy === "weighted"
                  ? "btn btn-sm md:btn-md lg:btn-lg btn-active btn-success"
                  : "btn btn-sm sm:btn-sm md:btn-md lg:btn-lg btn-outline"
              } px-4 py-2 rounded-md`}
              onClick={() => handleStrategyChange("weighted")}
            >
              Weighted
            </button>
            <p className="text-t2">
              Voting power is 1:1 to user token balance.
            </p>
          </div>
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
  const handleParameterChange = (amount: number) => {
    if (Number.isInteger(amount)) setVotingPower(amount.toString());
  };

  if (selectedStrategy === "arcade") {
    return (
      <>
        <label className="font-medium ">Voting Power</label>
        <input
          className="input input-primary w-full"
          type="number"
          value={votingPower || ""}
          onChange={(e) => {
            handleParameterChange(Number(e.target.value));
          }}
        />
      </>
    );
  }

  return null;
};

export default VotingPolicy;
