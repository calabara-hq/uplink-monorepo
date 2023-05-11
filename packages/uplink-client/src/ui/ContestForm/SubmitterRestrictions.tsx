import {
  arraysSubtract,
  ContestBuilderProps,
  SubmitterRestriction,
} from "@/lib/contestHandler";
import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./ContestForm";
import { IToken } from "@/types/token";
import { useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";
import TokenBadge from "../TokenBadge/TokenBadge";
import { TrashIcon} from "@heroicons/react/24/solid";

const SubmitterRestrictions = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEditRestriction = (index: number) => {
    setEditIndex(index);
    setIsTokenModalOpen(true);
  };

  return (
    <BlockWrapper
      title="Submitter Restrictions"
      info="Select the tokens and their respective thresholds that the submitter
    must hold to be able to submit."
    >
      <div className="flex flex-col items-center w-full gap-4">
        <button
          className="btn"
          onClick={() => {
            setIsTokenModalOpen(true);
          }}
        >
          Add Restriction
        </button>

        {state.submitterRestrictions.length > 0 && (
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
                      <td className="text-center">
                        <p>{restriction?.token?.symbol}</p>
                        <div className="p-1" />

                        <TokenBadge token={restriction?.token} />
                      </td>
                      <td className="text-center">
                        <p>{restriction.threshold}</p>

                        <button
                          className="btn btn-sm btn-ghost link"
                          onClick={() => handleEditRestriction(index)}
                        >
                          edit
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => {
                            dispatch({
                              type: "removeSubmitterRestriction",
                              payload: index,
                            });
                          }}
                        >
                          Remove
                          <TrashIcon className="w-5 ml-2" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Modal
          isModalOpen={isTokenModalOpen}
          onClose={() => {
            setIsTokenModalOpen(false);
            setEditIndex(null);
          }}
        >
          <SubmitterRestrictionManager
            setIsModalOpen={setIsTokenModalOpen}
            state={state}
            dispatch={dispatch}
            editIndex={editIndex}
          />
        </Modal>
      </div>
    </BlockWrapper>
  );
};

const initialRestrictionState: SubmitterRestriction = {};

type RestrictionAction =
  | { type: "setToken"; payload: IToken }
  | { type: "setThreshold"; payload: string };

const restrictionReducer = (
  state: SubmitterRestriction,
  action: RestrictionAction
): SubmitterRestriction => {
  switch (action.type) {
    case "setToken":
      return { ...state, token: action.payload };
    case "setThreshold":
      return { ...state, threshold: action.payload };
    default:
      return state;
  }
};

const SubmitterRestrictionManager = ({
  setIsModalOpen,
  state,
  dispatch,
  editIndex,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
  editIndex: number | null;
}) => {
  const isEdit = typeof editIndex === "number";
  const [currentRestriction, setCurrentRestriction] = useReducer(
    restrictionReducer,
    isEdit ? state.submitterRestrictions[editIndex] : initialRestrictionState
  );
  const [progress, setProgress] = useState<number>(isEdit ? 1 : 0);

  const saveTokenCallback = (token: IToken) => {
    setCurrentRestriction({ type: "setToken", payload: token });
    setProgress(1);
  };

  if (progress === 0) {
    return (
      <TokenManager
        setIsModalOpen={setIsModalOpen}
        saveCallback={saveTokenCallback}
        existingTokens={state.submitterRestrictions.map(
          (restriction) => restriction?.token as IToken
        )}
        quickAddTokens={arraysSubtract(
          state.spaceTokens,
          state.submitterRestrictions.map(
            (restriction) => restriction?.token as IToken
          )
        )}
        uniqueStandard={false}
        continuous={true}
      />
    );
  }

  if (progress === 1) {
    return (
      <>
        <ThresholdManager
          currentRestriction={currentRestriction}
          setCurrentRestriction={setCurrentRestriction}
        />
        <ModalActions
          //TODO update confirm actions
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            isEdit
              ? dispatch({
                  type: "updateSubmitterRestriction",
                  payload: {
                    index: editIndex,
                    restriction: currentRestriction,
                  },
                })
              : dispatch({
                  type: "addSubmitterRestriction",
                  payload: currentRestriction,
                });
            setIsModalOpen(false);
          }}
          confirmLabel="Save"
          confirmDisabled={!currentRestriction.threshold}
        />
      </>
    );
  }
  return null;
};

const ThresholdManager = ({
  currentRestriction,
  setCurrentRestriction,
}: {
  currentRestriction: SubmitterRestriction;
  setCurrentRestriction: React.Dispatch<any>;
}) => {
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRestriction({
      type: "setThreshold",
      payload: e.target.value,
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xl font-medium">Threshold</label>
      <div className="flex flex-col gap-2">
        <p>{currentRestriction?.token?.symbol}</p>
        <TokenBadge token={currentRestriction?.token} />
      </div>
      <p>
        The number of tokens a submitter must hold to be able to submit to this
      </p>
      <input
        className="input w-full max-w-xs"
        type="number"
        value={currentRestriction?.threshold || ""}
        onChange={handleThresholdChange}
      />{" "}
    </div>
  );
};

export default SubmitterRestrictions;
