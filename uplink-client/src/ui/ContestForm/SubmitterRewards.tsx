import { useState, useEffect, useReducer, Fragment } from "react";
import { BlockWrapper } from "./Entrypoint";
import TokenModal from "@/ui/TokenModal/TokenModal";
import { IToken } from "@/types/token";
import TokenCard from "../TokenCard/TokenCard";
import { HiTrash } from "react-icons/hi2";
import { AiOutlinePlus } from "react-icons/ai";
import {
  arraysSubtract,
  ContestBuilderProps,
  rewardsObjectToArray,
  validateSubmitterRewards,
  SubmitterRewards,
  RewardError,
} from "@/ui/ContestForm/contestHandler";

/**
 * submitter rewards should first allow the user to select from a list of space tokens or add new ones
 * after choosing the proper tokens, the user should be able to select the amount of tokens to be distributed to each rank
 * the user must choose at least 1 token to be distributed to each rank (eth, erc20, erc721, erc1155)
 * more than 1 token can be distributed to each rank, but not more than 1 of each unique standard (ERC20 etc)
 */

const SubmitterRewards = ({
  initialSubmitterRewards,
  spaceTokens,
  handleConfirm,
  errors,
  setErrors
}: {
  initialSubmitterRewards: SubmitterRewards;
  spaceTokens: IToken[];
  handleConfirm: (submitterRewards: SubmitterRewards) => void;
  errors: RewardError;
  setErrors: (errors: RewardError) => void;
}) => {
  const [rewards, setRewards] = useState<SubmitterRewards>(
    initialSubmitterRewards
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddToken = (token: IToken) => {
    setRewards({
      ...rewards,
      [token.type]: token,
      // add the type to each payout
      payouts: (
        rewards?.payouts ?? [
          {
            rank: 1,
            [token.type]:
              token.type === "ERC721" ? { tokenId: null } : { amount: "" },
          },
        ]
      ).map((payout: any) => {
        return {
          ...payout,
          [token.type]: {
            ...payout[token.type],
            ...(token.type === "ERC721"
              ? { tokenId: payout[token.type]?.tokenId ?? null }
              : { amount: payout[token.type]?.amount ?? "" }),
          },
        };
      }),
    });
  };

  const handleRemoveToken = (token: IToken) => {
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
    const { errors, isError, data } = validateSubmitterRewards(rewards);
    if (isError) return setErrors(errors);
    handleConfirm(data);
  };

  return (
    <BlockWrapper
      title="Submitter Rewards"
      info="Define the winning submissions and the rewards they will receive"
    >
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 sm gap-4">
        <div
      className="card btn bg-base-200 h-24 normal-case"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-row gap-2 items-center">
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
      <SubmitterRewardMatrix
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
          rewardsObjectToArray(rewards)
        )}
        uniqueStandard={true}
        continuous={false}
      />
      <button
        onClick={onSubmit}
        className="btn btn-primary mt-4 self-end normal-case"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

const SubmitterRewardMatrix = ({
  rewards,
  setRewards,
  errors,
}: {
  rewards: ContestBuilderProps["submitterRewards"];
  setRewards: (rewards: ContestBuilderProps["submitterRewards"]) => void;
  errors: { duplicateRanks: number[] };
}) => {
  const addRank = () => {
    setRewards({
      ...rewards,
      payouts: [
        ...rewards.payouts,
        {
          rank: rewards.payouts.length + 1,
          ...(rewards.ETH ? { ETH: { amount: "" } } : {}),
          ...(rewards.ERC20 ? { ERC20: { amount: "" } } : {}),
          ...(rewards.ERC721 ? { ERC721: { tokenId: null } } : {}),
          ...(rewards.ERC1155 ? { ERC1155: { amount: "" } } : {}),
        },
      ],
    });
  };

  const removeRank = (index: number) => {
    setRewards({
      ...rewards,
      payouts: rewards.payouts.filter((_, i) => i !== index),
    });
  };

  const updateRank = (index: number, rank: number) => {
    if (Number.isInteger(rank)) {
      setRewards({
        ...rewards,
        payouts: rewards.payouts.map((payout, i) => {
          if (i === index) {
            return { ...payout, rank: rank };
          }
          return payout;
        }),
      });
    }
  };

  const updateAmount = (
    index: number,
    tokenType: keyof SubmitterRewards,
    amount: string
  ) => {
    setRewards({
      ...rewards,
      payouts: rewards.payouts.map((payout, i) => {
        if (i === index) {
          return {
            ...payout,
            [tokenType]: {
              ...payout[tokenType],
              amount: amount,
            },
          };
        }
        return payout;
      }),
    });
  };

  const updateERC721TokenId = (index: number, tokenId: string) => {
    let roundedTokenId =
      tokenId.trim() === "" ? null : Math.round(Number(tokenId));

    setRewards({
      ...rewards,
      payouts: rewards.payouts.map((payout, i) => {
        if (i === index) {
          return {
            ...payout,
            ERC721: {
              ...payout.ERC721,
              tokenId: tokenId === "" ? null : roundedTokenId,
            },
          };
        }
        return payout;
      }),
    });
  };

  if (rewards.ETH || rewards.ERC20 || rewards.ERC721 || rewards.ERC1155) {
    return (
      <div className="overflow-x-auto w-full">
        {errors.duplicateRanks.length > 0 ? (
          <div className="text-red-500">
            <p>oops, you have some duplicate ranks</p>
          </div>
        ) : null}
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th className="text-center">Rank</th>
              {rewards.ETH ? <th className="text-center">ETH Payout</th> : null}
              {rewards.ERC20 ? (
                <th className="text-center">ERC20 Payout</th>
              ) : null}
              {rewards.ERC721 ? (
                <th className="text-center">ERC721 Token ID</th>
              ) : null}
              {rewards.ERC1155 ? (
                <th className="text-center">ERC1155 Payout</th>
              ) : null}
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody className="w-full">
            {rewards?.payouts?.map((payout, index) => (
              <tr key={index}>
                <th className="w-24 text-center">
                  <input
                    className={`input w-24 text-center ${
                      errors.duplicateRanks.includes(index)
                        ? "input-error"
                        : "input-bordered"
                    }`}
                    type="number"
                    value={payout.rank || ""}
                    onChange={(e) => updateRank(index, Number(e.target.value))}
                  />
                </th>

                {payout.ETH ? (
                  <td className="text-center ">
                    <input
                      className="input input-bordered text-center w-14 lg:w-28"
                      type="number"
                      value={payout.ETH?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ETH", e.target.value)
                      }
                    />
                  </td>
                ) : null}

                {payout.ERC20 ? (
                  <td className="text-center ">
                    <input
                      className="input input-bordered text-center w-14 lg:w-28"
                      type="number"
                      value={payout.ERC20?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC20", e.target.value)
                      }
                    ></input>
                  </td>
                ) : null}

                {payout.ERC721 ? (
                  <td className="text-center">
                    <input
                      className="input input-bordered text-center w-14 lg:w-28"
                      type="number"
                      value={
                        payout.ERC721?.tokenId !== null
                          ? payout.ERC721.tokenId
                          : ""
                      }
                      onChange={(e) =>
                        updateERC721TokenId(index, e.target.value)
                      }
                    ></input>
                  </td>
                ) : null}

                {payout.ERC1155 ? (
                  <td className="text-center">
                    <input
                      className="input input-bordered text-center w-14 lg:w-28"
                      type="number"
                      value={payout.ERC1155?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC1155", e.target.value)
                      }
                    ></input>
                  </td>
                ) : null}

                {rewards?.payouts?.length && rewards.payouts.length > 1 ? (
                  <td className="w-12">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => removeRank(index)}
                    >
                      <HiTrash className="w-6 h-6" />
                    </button>
                  </td>
                ) : (
                  <td className="w-32 text-right"></td>
                )}
              </tr>
            ))}
            <tr>
              <th>
                <button className="btn btn-sm btn-ghost " onClick={addRank}>
                  Add Rank
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  return null;
};

export default SubmitterRewards;
