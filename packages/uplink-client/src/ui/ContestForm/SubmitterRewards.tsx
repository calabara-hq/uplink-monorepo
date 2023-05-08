import {
  arraysSubtract,
  ContestBuilderProps,
  rewardsObjectToArray,
  SubmitterRewards,
} from "@/app/contestbuilder/contestHandler";
import { useState, useEffect, useReducer, Fragment } from "react";
import { BlockWrapper } from "./ContestForm";
import TokenModal from "@/ui/TokenModal/TokenModal";
import { IToken } from "@/types/token";
import TokenCard from "../TokenCard/TokenCard";
import { TrashIcon, SparklesIcon } from "@heroicons/react/24/solid";
import InfoAlert from "../InfoAlert/InfoAlert";

/**
 * submitter rewards should first allow the user to select from a list of space tokens or add new ones
 * after choosing the proper tokens, the user should be able to select the amount of tokens to be distributed to each rank
 * the user must choose at least 1 token to be distributed to each rank (eth, erc20, erc721, erc1155)
 * more than 1 token can be distributed to each rank, but not more than 1 token type
 */

// type the reducer functions

type AddSubRankAction = {
  type: "addSubRank";
};

type RemoveSubRankAction = {
  type: "removeSubRank";
  payload: number;
};

type UpdateSubRankAction = {
  type: "updateSubRank";
  payload: { index: number; rank: number };
};

type UpdateSubRewardAction = {
  type: "updateSubRewardAmount";
  payload: { index: number; tokenType: keyof SubmitterRewards; amount: string };
};

type UpdateERC721TokenIdAction = {
  type: "updateERC721TokenId";
  payload: { index: number; tokenId: number | null };
};

const SubmitterRewardsComponent = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSaveCallback = (data: IToken) => {
    return dispatch({ type: "addSubmitterReward", payload: { token: data } });
  };

  const handleRemove = (token: IToken) => {
    dispatch({
      type: "removeSubmitterReward",
      payload: { token: token },
    });
  };

  return (
    <BlockWrapper title="Submitter Rewards">
      <InfoAlert>
        <p>
          Select the tokens that will be distributed to the top X submitters
        </p>
      </InfoAlert>
      <div className="flex flex-col lg:flex-row w-full gap-4">
        {rewardsObjectToArray(state.submitterRewards).map((token, index) => {
          return (
            <TokenCard
              key={index}
              token={token}
              handleRemove={() => handleRemove(token)}
            />
          );
        })}
      </div>
      <button className="btn" onClick={() => setIsModalOpen(true)}>
        add reward
      </button>
      <SubmitterRewardMatrix state={state} dispatch={dispatch} />
      <TokenModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        saveCallback={handleSaveCallback}
        existingTokens={rewardsObjectToArray(state.submitterRewards)}
        quickAddTokens={arraysSubtract(
          state.spaceTokens,
          rewardsObjectToArray(state.submitterRewards)
        )}
        uniqueStandard={true}
        continuous={false}
      />
    </BlockWrapper>
  );
};


const SubmitterRewardMatrix = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<
    | AddSubRankAction
    | RemoveSubRankAction
    | UpdateSubRankAction
    | UpdateSubRewardAction
    | UpdateERC721TokenIdAction
  >;
}) => {
  const { submitterRewards, errors } = state;

  const addRank = () => {
    dispatch({ type: "addSubRank" });
  };

  const removeRank = (index: number) => {
    dispatch({ type: "removeSubRank", payload: index });
  };

  const updateRank = (index: number, rank: number) => {
    if (Number.isInteger(rank)) {
      dispatch({
        type: "updateSubRank",
        payload: { index, rank: rank },
      });
    }
  };

  const updateAmount = (
    index: number,
    tokenType: keyof SubmitterRewards,
    amount: string
  ) => {
    dispatch({
      type: "updateSubRewardAmount",
      payload: { index, tokenType, amount },
    });
  };

  const updateERC721TokenId = (index: number, tokenId: string) => {
    let roundedTokenId =
      tokenId.trim() === "" ? null : Math.round(Number(tokenId));

    dispatch({
      type: "updateERC721TokenId",
      payload: { index, tokenId: tokenId === "" ? null : roundedTokenId },
    });
  };

  if (
    submitterRewards.ETH ||
    submitterRewards.ERC20 ||
    submitterRewards.ERC721 ||
    submitterRewards.ERC1155
  ) {
    return (
      <div className="overflow-x-auto w-full">
        {errors?.submitterRewards?.duplicateRanks?.length ?? 0 > 0 ? (
          <div className="text-red-500">
            <p>oops, you have some duplicate ranks</p>
          </div>
        ) : null}
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th className="text-center">Rank</th>
              {submitterRewards.ETH ? (
                <th className="text-center">ETH Payout</th>
              ) : null}
              {submitterRewards.ERC20 ? (
                <th className="text-center">ERC20 Payout</th>
              ) : null}
              {submitterRewards.ERC721 ? (
                <th className="text-center">ERC721 Token ID</th>
              ) : null}
              {submitterRewards.ERC1155 ? (
                <th className="text-center">ERC1155 Payout</th>
              ) : null}
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody className="w-full">
            {submitterRewards?.payouts?.map((payout, index) => (
              <tr key={index}>
                <th className="w-24 text-center">
                  <input
                    className={`input w-24 ${
                      errors?.submitterRewards?.duplicateRanks?.includes(index)
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
                      className="input input-bordered focus:bg-neutral text-center w-14 lg:w-28"
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
                      className="input input-bordered focus:bg-neutral text-center w-14 lg:w-28"
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
                      className="input input-bordered focus:bg-neutral text-center w-14 lg:w-28"
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
                      className="input input-bordered focus:bg-neutral text-center w-14 lg:w-28"
                      type="number"
                      value={payout.ERC1155?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC1155", e.target.value)
                      }
                    ></input>
                  </td>
                ) : null}

                {submitterRewards?.payouts?.length &&
                submitterRewards.payouts.length > 1 ? (
                  <td className="w-12">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => removeRank(index)}
                    >
                      <TrashIcon className="w-6" />
                    </button>
                  </td>
                ) : (
                  <td className="w-32 text-right"></td>
                )}
              </tr>
            ))}
            <tr>
              <th>
                <button className="btn btn-sm" onClick={addRank}>
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

export default SubmitterRewardsComponent;
