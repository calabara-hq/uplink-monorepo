import TokenCard from "../TokenCard/TokenCard";
import { BlockWrapper } from "./Entrypoint";
import TokenModal from "../TokenModal/TokenModal";
import { IToken } from "@/types/token";
import { useEffect, useMemo, useState } from "react";
import MenuSelect, { Option } from "../MenuSelect/MenuSelect";
import { HiTrash } from "react-icons/hi2";
import {
  arraysSubtract,
  ContestBuilderProps,
  RewardError,
  rewardsObjectToArray,
  VoterRewards,
  cleanVoterRewards,
} from "./contestHandler";
import { validateVoterRewards } from "./contestHandler";
import { AiOutlinePlus } from "react-icons/ai";

const VoterRewards = ({
  initialVoterRewards,
  spaceTokens,
  handleConfirm,
  errors,
  setErrors
}: {
  initialVoterRewards: VoterRewards;
  spaceTokens: IToken[];
  handleConfirm: (voterRewards: VoterRewards) => void;
  errors: RewardError;
  setErrors: (errors: RewardError) => void;
}) => {
  const [rewards, setRewards] = useState<VoterRewards>(initialVoterRewards);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddToken = (token: IToken) => {
    if (token.type === "ERC721" || token.type === "ERC1155") return; // voter rewards can't be non-fungible
    const { [token.type]: _, ...updatedRewards } = rewards;

    setRewards({
      ...updatedRewards,
      [token.type]: token,
      // add the type to each payout
      payouts: (
        rewards.payouts ?? [
          {
            rank: 1,
            [token.type]: { amount: "" },
          },
        ]
      ).map((payout: any) => {
        return {
          ...payout,
          [token.type]: {
            ...payout[token.type],
            amount: payout[token.type]?.amount ?? "",
          },
        };
      }),
    });
  };

  const handleRemoveToken = (token: IToken) => {
    if (token.type === "ERC721" || token.type === "ERC1155") return; // voter rewards can't be non-fungible
    const { [token.type]: _, payouts, ...updatedRewards } = rewards;

    const hasOtherRewardTypes = Object.keys(updatedRewards).length > 0;
    const updatedPayouts = hasOtherRewardTypes ? [] : null;

    if (hasOtherRewardTypes) {
      for (let i = 0; i < rewards.payouts.length; i++) {
        const payout = rewards.payouts[i];
        const { [token.type]: _, ...updatedPayout } = payout;
        if (Object.keys(updatedPayout).length > 0) {
          if (updatedPayouts !== null) {
            updatedPayouts.push(updatedPayout);
          }
        }
      }
    }

    setRewards({
      ...updatedRewards,
      ...(updatedPayouts !== null && { payouts: updatedPayouts }),
    });
  };

  const onSubmit = () => {
    const { errors, isError, data } = validateVoterRewards(rewards);
    if (isError) return setErrors(errors);
    handleConfirm(data);
  };

  return (
    <BlockWrapper
      title="Voter Rewards"
      info="Define the rewards that will be split amongst voters who accuraterly predict contest outcomes"
    >
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 sm gap-4">
        <div
          className="card btn bg-base-200 h-24"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-row gap-2 items-center normal-case">
            <AiOutlinePlus className="w-6 h-6" />
            <p>Add Reward</p>
          </div>
        </div>
        {rewardsObjectToArray(rewards).map((token, index) => {
          return (
            <TokenCard
              key={index}
              token={token}
              handleRemove={() => handleRemoveToken(token)}
            />
          );
        })}
      </div>
      <VoterRewardsMatrix
        rewards={rewards}
        setRewards={setRewards}
        errors={errors}
      />

      <TokenModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        saveCallback={handleAddToken}
        existingTokens={rewardsObjectToArray(rewards)}
        quickAddTokens={arraysSubtract(
          spaceTokens,
          rewardsObjectToArray(rewards),
          ["ETH", "ERC20"]
        )}
        uniqueStandard={true}
        strictTypes={["ERC20"]}
        continuous={false}
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

const VoterRewardsMatrix = ({ rewards, setRewards, errors }) => {
  const addRank = () => {
    setRewards((prevRewards) => ({
      ...prevRewards,
      payouts: [
        ...prevRewards.payouts,
        {
          rank: prevRewards.payouts.length + 1,
          ...(prevRewards.ETH ? { ETH: { amount: "" } } : {}),
          ...(prevRewards.ERC20 ? { ERC20: { amount: "" } } : {}),
        },
      ],
    }));
  };

  const menuSelectOptions = useMemo(
    () =>
      Object.entries(rewards)
        .filter(([key, value]) => key !== "payouts" && value !== null)
        .flatMap(([key, value]) => value)
        .map((token: IToken) => ({
          value: token.type,
          label: token.symbol,
        })),
    [rewards]
  );

  if (rewards.ETH || rewards.ERC20) {
    return (
      <div className="flex flex-col w-full gap-2">
        {errors.duplicateRanks?.length > 0 && (
          <div className="text-error self-start">
            <p>Oops, you have some duplicate ranks</p>
          </div>
        )}
        {rewards.payouts.map((reward, index) => (
          <VoterRewardRow
            key={index}
            index={index}
            reward={reward}
            allRewards={rewards}
            setRewards={setRewards}
            menuSelectOptions={menuSelectOptions}
            errors={errors}
          />
        ))}
        <button className="btn btn-sm btn-ghost w-fit" onClick={addRank}>
          Add rank
        </button>
      </div>
    );
  }
  return null;
};

const VoterRewardRow = ({
  index,
  reward,
  allRewards,
  setRewards,
  menuSelectOptions,
  errors,
}) => {
  const [selectedToken, setSelectedToken] = useState(menuSelectOptions[0]);
  useEffect(() => {
    // Check if the current selectedToken is still in the updated menuSelectOptions
    const isSelectedTokenPresent = menuSelectOptions.some(
      (option) => option.value === selectedToken.value
    );

    // If not present, reset to the first item
    if (!isSelectedTokenPresent) {
      setSelectedToken(menuSelectOptions[0]);
    }
  }, [menuSelectOptions]);

  const removeRank = () => {
    const newPayouts = allRewards.payouts.filter((_, i) => i !== index);
    setRewards((prevRewards) => ({ ...prevRewards, payouts: newPayouts }));
  };

  const updateRank = (newRank) => {
    if (Number.isInteger(newRank)) {
      const updatedPayouts = allRewards.payouts.map((payout, i) =>
        i === index ? { ...payout, rank: newRank } : payout
      );
      setRewards((prevRewards) => ({
        ...prevRewards,
        payouts: updatedPayouts,
      }));
    }
  };

  const updateTokenType = (option) => {
    if (selectedToken.value === option.value) return;

    const updatedPayouts = [...allRewards.payouts];
    updatedPayouts[index][option.value] = {
      amount: updatedPayouts[index][selectedToken.value]?.amount || "",
    };
    delete updatedPayouts[index][selectedToken.value];
    setSelectedToken(option);
    setRewards((prevRewards) => ({ ...prevRewards, payouts: updatedPayouts }));
  };

  const updateAmount = (tokenType, amount) => {
    const updatedPayouts = allRewards.payouts.map((payout, i) =>
      i === index
        ? {
            ...payout,
            [tokenType]: {
              ...payout[tokenType],
              amount: amount,
            },
          }
        : payout
    );
    setRewards((prevRewards) => ({ ...prevRewards, payouts: updatedPayouts }));
  };
  return (
    <div className="flex flex-col lg:flex-row items-center w-full justify-between gap-2 bg-base-100 p-4 rounded-xl">
      <p className="text-center">Voters that accurately choose rank </p>
      <input
        className={`input w-16 text-center ${
          errors?.duplicateRanks?.includes(index)
            ? "input-error"
            : "input-bordered"
        }`}
        type="number"
        value={reward.rank || ""}
        onChange={(e) => updateRank(Number(e.target.value))}
      />
      <p>will split</p>
      <input
        className="input input-bordered  text-center w-16 lg:w-24"
        type="number"
        value={reward[selectedToken.value]?.amount ?? ""}
        onChange={(e) => updateAmount(selectedToken.value, e.target.value)}
      />
      <MenuSelect
        selected={selectedToken}
        setSelected={(option) => updateTokenType(option)}
        options={menuSelectOptions}
      />
      {allRewards.payouts.length > 1 && (
        <button
          className="btn btn-sm lg:btn-square btn-ghost ml-auto lg:m-0"
          onClick={removeRank}
        >
          <HiTrash className="w-4 h-4 lg:w-6 lg:h-6" />
        </button>
      )}
    </div>
  );
};

export default VoterRewards;
