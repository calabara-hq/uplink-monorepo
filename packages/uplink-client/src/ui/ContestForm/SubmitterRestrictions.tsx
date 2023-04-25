import {
  arraysSubtract,
  ContestBuilderProps,
} from "@/app/contestbuilder/contestHandler";
import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./ContestForm";
import { IToken } from "@/types/token";
import { SubmitterRestriction } from "@/app/contestbuilder/contestHandler";
import { useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";

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
                    <td className="text-center">
                      {restriction?.token?.symbol}
                    </td>
                    <td className="text-center">
                      <p>{restriction.threshold}</p>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleEditRestriction(index)}
                      >
                        edit
                      </button>
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
        <button
          className="btn btn-sm"
          onClick={() => {
            setIsTokenModalOpen(true);
          }}
        >
          Add Restriction
        </button>
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
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-medium">threshold</label>
      <input
        className="input input-bordered w-full max-w-xs"
        type="number"
        value={currentRestriction?.threshold || ""}
        onChange={handleThresholdChange}
      />{" "}
    </div>
  );
};

export default SubmitterRestrictions;
