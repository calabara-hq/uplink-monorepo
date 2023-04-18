import {
  arraysSubtract,
  ContestBuilderProps,
} from "@/app/contestbuilder/contestHandler";
import TokenModal from "../TokenModal/TokenModal";
import { BlockWrapper } from "./ContestForm";
import { IToken } from "@/types/token";
import { SubmitterRestriction } from "@/app/contestbuilder/contestHandler";
import { useState } from "react";
import Modal from "../Modal/Modal";

const SubmitterRestrictions = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);

  const handleAddToken = (token: IToken) => {
    dispatch({
      type: "addSubmitterRestriction",
      payload: { token: token },
    });
  };

  const updateThreshold = (index: number, value: string) => {
    dispatch({
      type: "updateSubRestrictionThreshold",
      payload: {
        index: index,
        threshold: value,
      },
    });
  };

  return (
    <BlockWrapper title="Submitter Restrictions">
      <div className="flex flex-col w-full gap-2">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">Token</th>
                <th className="text-center">Threshold</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody className="w-full">
              {state.submitterRestrictions.map((restriction, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{restriction.symbol}</td>
                    <td className="text-center">
                      <input
                        className="input input-bordered w-32"
                        type="number"
                        value={restriction.threshold || ""}
                        onChange={(e) => updateThreshold(index, e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          dispatch({
                            type: "removeSubmitterRestriction",
                            payload: index,
                          });
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          className="btn btn-sm"
          onClick={() => {
            setIsTokenModalOpen(true);
          }}
        >
          Add Restriction
        </button>
      </div>
      <TokenModal
        isModalOpen={isTokenModalOpen}
        setIsModalOpen={setIsTokenModalOpen}
        saveCallback={handleAddToken}
        existingTokens={state.submitterRestrictions}
        quickAddTokens={arraysSubtract(
          state.spaceTokens,
          state.submitterRestrictions
        )}
        uniqueStandard={false}
        continuous={false}
      />
    </BlockWrapper>
  );
};

export default SubmitterRestrictions;
