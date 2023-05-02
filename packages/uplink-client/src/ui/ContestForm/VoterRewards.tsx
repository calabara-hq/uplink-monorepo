import TokenCard from "../TokenCard/TokenCard";
import { BlockWrapper } from "./ContestForm";
import {
  arraysSubtract,
  ContestBuilderProps,
  RewardError,
  rewardsObjectToArray,
  VoterRewards,
} from "@/app/contestbuilder/contestHandler";
import TokenModal from "../TokenModal/TokenModal";
import { IToken } from "@/types/token";
import { useEffect, useState } from "react";
import MenuSelect, { Option } from "../MenuSelect/MenuSelect";

const VoterRewardsComponent = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSaveCallback = (data: IToken) => {
    return dispatch({ type: "addVoterReward", payload: { token: data } });
  };

  const handleRemove = (token: IToken) => {
    dispatch({
      type: "removeVoterReward",
      payload: { token: token },
    });
  };

  return (
    <BlockWrapper title="Voter Rewards">
      <div className="flex flex-col w-full gap-2">
        {rewardsObjectToArray(state.voterRewards).map((token, index) => {
          return (
            <TokenCard
              key={index}
              token={token}
              handleRemove={() => handleRemove(token)}
            />
          );
        })}
      </div>

      <VoterRewardsMatrix
        spaceTokens={state.spaceTokens}
        state={state}
        dispatch={dispatch}
      />

      <TokenModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        saveCallback={handleSaveCallback}
        existingTokens={rewardsObjectToArray(state.voterRewards)}
        quickAddTokens={arraysSubtract(
          state.spaceTokens,
          rewardsObjectToArray(state.voterRewards),
          ["ETH", "ERC20"]
        )}
        uniqueStandard={true}
        strictTypes={["ERC20"]}
        continuous={false}
      />

      <button className="btn" onClick={() => setIsModalOpen(true)}>
        add reward
      </button>
    </BlockWrapper>
  );
};

const VoterRewardsMatrix = ({
  spaceTokens,
  state,
  dispatch,
}: {
  spaceTokens: IToken[];
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const { voterRewards, errors } = state;

  const addRank = () => {
    dispatch({ type: "addVoterRank" });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {errors?.voterRewards?.duplicateRanks?.length ?? 0 > 0 ? (
        <div className="text-red-500">
          <p>oops, you have some duplicate ranks</p>
        </div>
      ) : null}
      {voterRewards && (
        <div className="flex flex-col gap-2">
          {(voterRewards.ERC20 || voterRewards.ETH) &&
            voterRewards?.payouts?.map((reward, index) => {
              return (
                <VoterRewardRow
                  key={index}
                  index={index}
                  reward={reward}
                  rewardsLength={voterRewards?.payouts?.length ?? 0}
                  availableRewardTokens={Object.entries(voterRewards)
                    .filter(
                      ([key, value]) => key !== "payouts" && value !== null
                    )
                    .flatMap(([key, value]) => value)}
                  dispatch={dispatch}
                  errors={errors?.voterRewards}
                />
              );
            })}
          <button className="btn btn-sm" onClick={addRank}>
            add
          </button>
        </div>
      )}
    </div>
  );
};

const VoterRewardRow = ({
  index,
  reward,
  availableRewardTokens,
  rewardsLength,
  dispatch,
  errors,
}: {
  index: number;
  reward: any;
  availableRewardTokens: IToken[];
  rewardsLength: number;
  dispatch: React.Dispatch<any>;
  errors?: RewardError;
}) => {
  const menuSelectOptions = availableRewardTokens.map((token) => {
    return { value: token.type, label: token.symbol };
  });
  const [selectedToken, setSelectedToken] = useState<Option>(
    menuSelectOptions[0]
  );

  const removeRank = () => {
    dispatch({ type: "removeVoterRank", payload: index });
  };

  const updateRank = (index: number, rank: number) => {
    if (Number.isInteger(rank)) {
      dispatch({
        type: "updateVoterRank",
        payload: { index, rank: rank },
      });
    }
  };

  const updateTokenType = (option: Option) => {
    dispatch({
      type: "updateVoterRewardType",
      payload: {
        index,
        oldTokenType: selectedToken.value,
        newTokenType: option.value,
      },
    });

    setSelectedToken(option);
  };

  const updateAmount = (index: number, tokenType: string, amount: string) => {
    console.log(typeof amount, amount);
    dispatch({
      type: "updateVoterRewardAmount",
      payload: { index, tokenType, amount },
    });
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <p>voters that accurately choose rank </p>
      <input
        className={`input w-16 ${
          errors?.duplicateRanks?.includes(index)
            ? "input-error"
            : "input-bordered"
        }`}
        type="number"
        value={reward.rank || ""}
        onChange={(e) => updateRank(index, Number(e.target.value))}
      />
      <p>will split</p>
      <input
        className="input input-bordered w-32"
        type="number"
        value={reward[selectedToken.value].amount || ""}
        onChange={(e) =>
          updateAmount(index, selectedToken.value, e.target.value)
        }
      />

      <MenuSelect
        selected={selectedToken}
        setSelected={updateTokenType}
        options={menuSelectOptions}
      />
      {rewardsLength > 1 && (
        <button className="btn btn-sm" onClick={removeRank}>
          delete
        </button>
      )}
    </div>
  );
};

export default VoterRewardsComponent;
