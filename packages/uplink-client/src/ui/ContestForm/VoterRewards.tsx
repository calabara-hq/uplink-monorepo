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
      <div className="alert alert-info p-2 w-fit shadow-lg">
        <div>
          <span>
            Select the tokens that will be distributed to the top X voters who accuraterly predict the outcome of the contest.
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center w-full gap-4">
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
      <div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          add reward
        </button>
      </div>
      <VoterRewardsMatrix
        spaceTokens={state.spaceTokens}
        voterRewards={state.voterRewards}
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
  const addRank = () => {
    dispatch({ type: "addVoterRank" });
  };

  return (
    <div className="flex flex-col w-full lg:w-3/4 bg-base-100 p-4 gap-2 rounded-xl shadow-xl">
      {voterRewards && (
        <div className="flex flex-col gap-4">
          {(voterRewards.ERC20 || voterRewards.ETH) &&
            voterRewards.payouts.map((reward, index) => {
              return (
                <VoterRewardRow
                  key={index}
                  index={index}
                  reward={reward}
                  availableRewardTokens={Object.entries(voterRewards)
                    .filter(
                      ([key, value]) => key !== "payouts" && value !== null
                    )
                    .flatMap(([key, value]) => value)}
                  dispatch={dispatch}
                />
              );
            })}
          <button className="btn btn-sm mr-auto" onClick={addRank}>
            add rank
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
  dispatch,
}: {
  index: number;
  reward: any;
  availableRewardTokens: IToken[];
  dispatch: React.Dispatch<any>;
}) => {
  console.log(availableRewardTokens);
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
    <div className="flex flex-row items-center justify-evenly gap-2">
      <p>Voters that accurately choose rank </p>
      <input
        className="input input-bordered focus:bg-neutral text-center w-16"
        type="number"
        value={reward.rank || ""}
        onChange={(e) => updateRank(index, Number(e.target.value))}
      />
      <p>will split</p>
      <input
        className="input input-bordered focus:bg-neutral text-center w-32"
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
      <button className="btn btn-sm btn-error" onClick={removeRank}>
        delete
      </button>
    </div>
  );
};

export default VoterRewardsComponent;
