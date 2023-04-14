import TokenCard from "../TokenCard/TokenCard";
import { BlockWrapper } from "./ContestForm";
import {
  arraysSubtract,
  ContestBuilderProps,
  rewardsObjectToArray,
  VoterRewards,
} from "@/app/contestbuilder/contestHandler";
import TokenModal from "../TokenModal/TokenModal";
import { IToken } from "@/types/token";
import { useState } from "react";
import MenuSelect, { Option } from "../MenuSelect/MenuSelect";

const VoterRewardsComponent = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSaveCallback = (data: IToken, actionType: "add" | "swap") => {
    if (actionType === "add")
      return dispatch({ type: "addVoterReward", payload: { token: data } });
    else if (actionType === "swap")
      return dispatch({
        type: "swapVoterReward",
        payload: { token: data },
      });
  };
  return (
    <BlockWrapper title="Voter Rewards">
      <div className="flex flex-col w-full gap-2">
        {rewardsObjectToArray(state.voterRewards).map((token, index) => {
          return <TokenCard key={index} token={token} dispatch={dispatch} />;
        })}
      </div>
      <button className="btn" onClick={() => setIsModalOpen(true)}>
        add reward
      </button>

      <VoterRewardsMatrix
        spaceTokens={state.spaceTokens}
        voterRewards={state.voterRewards}
        dispatch={dispatch}
      />
      <TokenModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        callback={handleSaveCallback}
        existingTokens={rewardsObjectToArray(state.voterRewards)}
        quickAddTokens={arraysSubtract(
          state.spaceTokens,
          rewardsObjectToArray(state.voterRewards),
          ["ETH", "ERC20"]
        )}
        strictStandard={true}
      />
    </BlockWrapper>
  );
};

const VoterRewardsMatrix = ({
  spaceTokens,
  voterRewards,
  dispatch,
}: {
  spaceTokens: IToken[];
  voterRewards: VoterRewards;
  dispatch: React.Dispatch<any>;
}) => {
  const onSelectCallback = (isSelected: boolean) => {
    dispatch({
      type: "toggleVoterRewards",
      payload: { selected: isSelected },
    });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {voterRewards && (
        <div className="">
          {voterRewards.payouts.map((reward, index) => {
            return (
              <VoterRewardRow
                key={index}
                index={index}
                reward={reward}
                availableRewardTokens={Object.entries(voterRewards)
                  .filter(([key, value]) => key !== "payouts" && value !== null)
                  .flatMap(([key, value]) => value)}
                dispatch={dispatch}
              />
            );
          })}
          <button className="btn btn-sm">add</button>
        </div>
      )}
    </div>
  );
};

const VoterRewardRow = ({
  index,
  reward,
  availableRewardTokens,
  dispatch,
}: {
  index: number;
  reward: any;
  availableRewardTokens: IToken[];
  dispatch: React.Dispatch<any>;
}) => {
  const menuSelectOptions = availableRewardTokens.map((token) => {
    return { value: token.symbol, label: token.type };
  });
  const [selectedToken, setSelectedToken] = useState<Option>(
    menuSelectOptions[0]
  );

  const addRank = () => {
    dispatch({ type: "addSubRank" });
  };

  const removeRank = (index: number) => {
    dispatch({ type: "removeSubRank", payload: index });
  };

  const updateRank = (index: number, rank: number) => {
    if (Number.isInteger(rank)) {
      dispatch({
        type: "updateVoterRewardRank",
        payload: { index, rank: rank },
      });
    }
  };

  const updateAmount = (index: number, tokenType: string, amount: string) => {
    console.log(typeof amount);
    dispatch({
      type: "updateVoterRewardAmount",
      payload: { index, tokenType, amount },
    });
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <p>voters that accurately choose rank </p>
      <input
        className="input input-bordered w-16"
        type="number"
        value={reward.rank || ""}
        onChange={(e) => updateRank(index, Number(e.target.value))}
      />
      <p>will split</p>
      <input
        className="input input-bordered w-32"
        type="number"
        value={reward.ETH?.amount || ""}
        onChange={(e) =>
          updateAmount(index, selectedToken.label, e.target.value)
        }
      />
      {/*
      <MenuSelect
        selected={selectedToken}
        setSelected={setSelectedToken}
        options={menuSelectOptions}
      />
    */}
    </div>
  );
};

export default VoterRewardsComponent;
