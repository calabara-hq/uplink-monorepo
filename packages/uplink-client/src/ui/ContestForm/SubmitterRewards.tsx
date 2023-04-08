import {
  ContestBuilderProps,
  SubmitterRewards,
} from "@/app/contestbuilder/contestHandler";
import { useState, useEffect, useReducer, Fragment } from "react";
import { BlockWrapper } from "./ContestForm";
import TokenModal from "@/ui/TokenModal/TokenModal";
import { IToken } from "@/types/token";

/**
 * submitter rewards should first allow the user to select from a list of space tokens or add new ones
 * after choosing the proper tokens, the user should be able to select the amount of tokens to be distributed to each rank
 * the user must choose at least 1 token to be distributed to each rank (eth, erc20, erc721, erc1155)
 * more than 1 token can be distributed to each rank, but not more than 1 token type
 */

// type the reducer functions

type AddRewardAction = {
  type: "addRewardOption";
  payload: IToken;
};

type SwapRewardAction = {
  type: "swapRewardOption";
  payload: IToken;
};

type ToggleRewardAction = {
  type: "toggleRewardOption";
  payload: { token: IToken; selected: boolean };
};

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
  const handleSaveCallback = (data: IToken, actionType: "add" | "swap") => {
    if (actionType === "add")
      return dispatch({ type: "addRewardOption", payload: data });
    else if (actionType === "swap")
      return dispatch({ type: "swapRewardOption", payload: data });
  };
  return (
    <BlockWrapper title="Submitter Rewards">
      <div className="flex flex-col w-full gap-2">
        {state.rewardOptions.map((token, index) => {
          return <TokenCard key={index} token={token} dispatch={dispatch} />;
        })}
      </div>
      <button className="btn" onClick={() => setIsModalOpen(true)}>
        add reward
      </button>
      <SubmitterRewardMatrix
        rewardOptions={state.rewardOptions}
        submitterRewards={state.submitterRewards}
        dispatch={dispatch}
      />
      <TokenModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        callback={handleSaveCallback}
        existingTokens={state.rewardOptions}
        strictStandard={true}
      />
    </BlockWrapper>
  );
};

const TokenCard = ({
  token,
  dispatch,
}: {
  token: IToken;
  dispatch: React.Dispatch<ToggleRewardAction>;
}) => {
  const onSelectCallback = (isSelected: boolean) => {
    dispatch({
      type: "toggleRewardOption",
      payload: { token: token, selected: isSelected },
    });
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{token.symbol}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <Toggle defaultState={false} onSelectCallback={onSelectCallback} />
        </div>
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
      className="toggle toggle-accent border-2"
      defaultChecked={defaultState}
      onChange={handleToggle}
    />
  );
};

const SubmitterRewardMatrix = ({
  rewardOptions,
  submitterRewards,
  dispatch,
}: {
  rewardOptions: IToken[];
  submitterRewards: SubmitterRewards;
  dispatch: React.Dispatch<
    | AddSubRankAction
    | RemoveSubRankAction
    | UpdateSubRankAction
    | UpdateSubRewardAction
    | UpdateERC721TokenIdAction
  >;
}) => {
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
    console.log(typeof amount);
    dispatch({
      type: "updateSubRewardAmount",
      payload: { index, tokenType, amount },
    });
  };

  const updateERC721TokenId = (index: number, tokenId: string) => {
    console.log(tokenId);
    dispatch({
      type: "updateERC721TokenId",
      payload: { index, tokenId: tokenId === "" ? null : Number(tokenId) },
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
                <th className="text-center">ERC721 Payout</th>
              ) : null}
              {submitterRewards.ERC1155 ? (
                <th className="text-center">ERC1155 Payout</th>
              ) : null}
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody className="w-full">
            {submitterRewards.payouts.map((payout, index) => (
              <tr key={index}>
                <th className="w-24 text-center">
                  <input
                    className="input input-bordered w-24"
                    type="number"
                    value={payout.rank || ""}
                    onChange={(e) => updateRank(index, Number(e.target.value))}
                  />
                </th>

                {payout.ETH ? (
                  <td className="text-center">
                    <input
                      className="input input-bordered w-32"
                      type="number"
                      value={payout.ETH?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ETH", e.target.value)
                      }
                    />
                  </td>
                ) : null}

                {payout.ERC20 ? (
                  <td className="text-center">
                    <input
                      className="input input-bordered w-32"
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
                      className="input input-bordered w-32"
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
                      className="input input-bordered w-32"
                      type="number"
                      value={payout.ERC1155?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC1155", e.target.value)
                      }
                    ></input>
                  </td>
                ) : null}

                {submitterRewards.payouts.length > 1 ? (
                  <td className="w-32 text-right">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => removeRank(index)}
                    >
                      Delete
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

    return (
      <div className="w-full overflow-x-auto flex justify-center">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th
                className={`${submitterRewards.ETH ? "table-cell" : "hidden"}`}
              >
                ETH Payout
              </th>
              <th
                className={`${
                  submitterRewards.ERC20 ? "table-cell" : "hidden"
                }`}
              >
                ERC20 Payout
              </th>
              <th
                className={`${
                  submitterRewards.ERC721 ? "table-cell" : "hidden"
                }`}
              >
                ERC721 Payout
              </th>
              <th
                className={`${
                  submitterRewards.ERC1155 ? "table-cell" : "hidden"
                }`}
              >
                ERC1155 Payout
              </th>
              <th>{/* the delete header */}</th>
            </tr>
          </thead>

          <tbody>
            {submitterRewards.payouts.map((payout, index) => (
              <tr key={index} className="w-full">
                <th>
                  <input
                    className="input input-bordered w-full max-w-full"
                    type="number"
                    value={payout.rank || ""}
                    onChange={(e) => updateRank(index, Number(e.target.value))}
                  />
                </th>
                {payout.ETH && (
                  <td>
                    <input
                      className="input input-bordered w-full max-w-full"
                      type="number"
                      value={payout.ETH?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ETH", e.target.value)
                      }
                    />
                  </td>
                )}

                {payout.ERC20 && (
                  <td>
                    <input
                      className="input input-bordered w-full max-w-full"
                      type="number"
                      value={payout.ERC20.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC20", e.target.value)
                      }
                    />
                  </td>
                )}
                {payout.ERC721 && (
                  <td>
                    <input
                      className="input input-bordered w-full max-w-full"
                      type="number"
                      value={payout.ERC721.tokenId || ""}
                      onChange={(e) =>
                        updateERC721TokenId(index, e.target.value)
                      }
                    />
                  </td>
                )}
                {payout.ERC1155 && (
                  <td>
                    <input
                      className="input input-bordered w-full max-w-full"
                      type="number"
                      value={payout.ERC1155.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC1155", e.target.value)
                      }
                    />
                  </td>
                )}
                {submitterRewards.payouts.length > 1 ? (
                  <td className="w-1/6 text-right">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => removeRank(index)}
                    >
                      Delete
                    </button>
                  </td>
                ) : (
                  <td className="w-1/6 text-right"></td>
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
          <tfoot></tfoot>
        </table>
      </div>
    );

    return (
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr className="w-full">
              <th className="bg-blue-100">Rank</th>
              {submitterRewards.ETH ? (
                <th className="bg-blue-200">ETH Payout</th>
              ) : (
                <th className="w-24"></th>
              )}
              {submitterRewards.ERC20 ? (
                <th className="bg-blue-300">ERC20 Payout</th>
              ) : (
                ""
              )}
              {submitterRewards.ERC721 ? (
                <th className="bg-blue-400">ERC721 Payout</th>
              ) : (
                ""
              )}
              {submitterRewards.ERC1155 ? (
                <th className="bg-blue-500">ERC1155 Payout</th>
              ) : (
                ""
              )}
              <th className="bg-blue-600">{/* delete header */}</th>
            </tr>
          </thead>
          <tbody>
            {submitterRewards.payouts.map((payout, index) => (
              <tr key={index} className="w-full">
                <td className="bg-blue-100">
                  <input
                    className="input input-bordered"
                    type="number"
                    value={payout.rank || ""}
                    onChange={(e) => updateRank(index, Number(e.target.value))}
                  />
                </td>
                <td className="bg-blue-200">
                  {payout.ETH ? (
                    <input
                      className="input input-bordered"
                      type="number"
                      value={payout.ETH?.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ETH", e.target.value)
                      }
                    />
                  ) : (
                    ""
                  )}
                </td>

                <td className="bg-blue-300">
                  {payout.ERC20 ? (
                    <input
                      className="input input-bordered"
                      type="number"
                      value={payout.ERC20.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC20", e.target.value)
                      }
                    />
                  ) : (
                    ""
                  )}
                </td>

                <td className="bg-blue-400">
                  {payout.ERC721 ? (
                    <input
                      className="input input-bordered"
                      type="number"
                      value={payout.ERC721.tokenId || ""}
                      onChange={(e) =>
                        updateERC721TokenId(index, e.target.value)
                      }
                    />
                  ) : (
                    ""
                  )}
                </td>
                <td className="bg-blue-500">
                  {payout.ERC1155 ? (
                    <input
                      className="input input-bordered"
                      type="number"
                      value={payout.ERC1155.amount || ""}
                      onChange={(e) =>
                        updateAmount(index, "ERC1155", e.target.value)
                      }
                    />
                  ) : (
                    ""
                  )}
                </td>
                <td className="bg-blue-600">
                  {submitterRewards.payouts.length > 1 ? (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => removeRank(index)}
                    >
                      Delete
                    </button>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>
                <button className="btn" onClick={addRank}>
                  Add Rank
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
  return null;
};

export default SubmitterRewardsComponent;
