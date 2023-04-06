import {
  ContestBuilderProps,
  SubmitterRewards,
} from "@/app/contestbuilder/contestHandler";
import { useState, useEffect, useReducer } from "react";
import { BlockWrapper } from "./ContestForm";
import TokenModal from "@/ui/TokenModal/TokenModal";
import { IToken } from "@/types/token";

/**
 * submitter rewards should first allow the user to select from a list of space tokens or add new ones
 * after choosing the proper tokens, the user should be able to select the amount of tokens to be distributed to each rank
 * the user must choose at least 1 token to be distributed to each rank (eth, erc20, erc721, erc1155)
 * more than 1 token can be distributed to each rank, but not more than 1 token type
 */

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
  dispatch: React.Dispatch<any>;
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
  dispatch: React.Dispatch<any>;
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
    dispatch({
      type: "updateSubRewardAmount",
      payload: { index, tokenType, amount },
    });
  };

  const updateERC721TokenId = (index: number, tokenId: string) => {
    dispatch({
      type: "updateERC721TokenId",
      payload: { index, tokenId },
    });
  };

  if (
    submitterRewards.ETH ||
    submitterRewards.ERC20 ||
    submitterRewards.ERC721 ||
    submitterRewards.ERC1155
  ) {
    return (
      <table className="table w-full">
        <thead>
          <tr>
            <th>Rank</th>
            {submitterRewards.ETH ? <th>ETH Payout</th> : null}
            {submitterRewards.ERC20 ? <th>ERC20 Payout</th> : null}
            {submitterRewards.ERC721 ? <th>ERC721 Payout</th> : null}
            {submitterRewards.ERC1155 ? <th>ERC1155 Payout</th> : null}
            <th>{/* delete header */}</th>
          </tr>
        </thead>
        <tbody>
          {submitterRewards.payouts.map((payout, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={payout.rank || ""}
                  onChange={(e) => updateRank(index, Number(e.target.value))}
                />
              </td>
              <td>
                {payout.ETH && (
                  <input
                    type="number"
                    value={payout.ETH?.amount || ""}
                    onChange={(e) => updateAmount(index, "ETH", e.target.value)}
                  />
                )}
              </td>

              <td>
                {payout.ERC20 && (
                  <input
                    type="number"
                    value={payout.ERC20.amount || ""}
                    onChange={(e) =>
                      updateAmount(index, "ERC20", e.target.value)
                    }
                  />
                )}
              </td>

              <td>
                {payout.ERC721 && (
                  <input
                    type="number"
                    value={payout.ERC721.tokenId || ""}
                    onChange={(e) => updateERC721TokenId(index, e.target.value)}
                  />
                )}
              </td>
              <td>
                {payout.ERC1155 && (
                  <input
                    type="number"
                    value={payout.ERC1155.amount || ""}
                    onChange={(e) =>
                      updateAmount(index, "ERC1155", e.target.value)
                    }
                  />
                )}
              </td>
              <td>
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
            <td colSpan={5}>
              <button className="btn" onClick={addRank}>
                Add Rank
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
  return null;
};

export default SubmitterRewardsComponent;
