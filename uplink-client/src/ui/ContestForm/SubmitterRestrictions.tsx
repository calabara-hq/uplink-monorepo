import { arraysSubtract, SubmitterRestriction } from "./contestHandler";
import TokenModal, { TokenManager } from "../TokenModal/TokenModal";
import { BlockWrapper } from "./Entrypoint";
import { IToken } from "@/types/token";
import { useReducer, useState } from "react";
import Modal, { ModalActions } from "../Modal/Modal";
import TokenBadge from "../TokenBadge/TokenBadge";
import { HiTrash, HiPencil, HiInformationCircle } from "react-icons/hi2";
import TokenCard from "../TokenCard/TokenCard";
import { AiOutlinePlus } from "react-icons/ai";

const SubmitterRestrictions = ({
  chainId,
  initialSubmitterRestrictions,
  handleConfirm,
  spaceTokens,
}: {
  chainId: number;
  initialSubmitterRestrictions: SubmitterRestriction[];
  handleConfirm: (submitterRestrictions: SubmitterRestriction[]) => void;
  spaceTokens: IToken[];
}) => {
  const [restrictions, setRestrictions] = useState<SubmitterRestriction[]>(
    initialSubmitterRestrictions
  );
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEditRestriction = (index: number) => {
    setEditIndex(index);
    setIsTokenModalOpen(true);
  };

  const removeRestriction = (index: number) => {
    setRestrictions((restrictions) => {
      restrictions.splice(index, 1);
      return [...restrictions];
    });
  };

  const onSubmit = () => {
    handleConfirm(restrictions);
  };

  return (
    <BlockWrapper
      title="Submitter Restrictions"
      info="Define assets users must hold to submit. Users satisfying at least one restriction will be eligible."
    >
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 sm gap-4">
        <div
          className="card btn bg-base-200 h-28 normal-case"
          onClick={() => setIsTokenModalOpen(true)}
        >
          <div className="flex flex-row gap-2 items-center ">
            <AiOutlinePlus className="w-6 h-6" />
            <p>Add Restriction</p>
          </div>
        </div>
        {restrictions.map((restriction, index) => {
          return (
            <TokenCard
              key={index}
              token={restriction.token}
              handleRemove={() => removeRestriction(index)}
              editCallback={() => handleEditRestriction(index)}
            >
              <p className="text-t1">
                threshold: <b>{restriction.threshold}</b>
              </p>
            </TokenCard>
          );
        })}
      </div>
      <Modal
        isModalOpen={isTokenModalOpen}
        onClose={() => {
          setIsTokenModalOpen(false);
          setEditIndex(null);
        }}
      >
        <SubmitterRestrictionManager
          chainId={chainId}
          setIsModalOpen={setIsTokenModalOpen}
          restrictions={restrictions}
          setRestrictions={setRestrictions}
          editIndex={editIndex}
          spaceTokens={spaceTokens}
        />
      </Modal>
      <button
        onClick={onSubmit}
        className="btn btn-primary normal-case mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

const SubmitterRestrictionManager = ({
  chainId,
  setIsModalOpen,
  restrictions,
  setRestrictions,
  editIndex,
  spaceTokens,
}: {
  chainId: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  restrictions: SubmitterRestriction[];
  setRestrictions: React.Dispatch<React.SetStateAction<SubmitterRestriction[]>>;
  editIndex: number | null;
  spaceTokens: IToken[];
}) => {
  const isEdit = typeof editIndex === "number";
  const [progress, setProgress] = useState<number>(isEdit ? 1 : 0);

  const [token, setToken] = useState<IToken | null>(
    isEdit ? restrictions[editIndex].token : null
  );
  const [threshold, setThreshold] = useState<string>(
    isEdit ? restrictions[editIndex].threshold : ""
  );

  const saveTokenCallback = (token: IToken) => {
    setToken(token);
    setProgress(1);
  };

  const updateSubmitterRestriction = () => {
    setRestrictions((restrictions) => {
      restrictions[editIndex] = { token, threshold };
      return [...restrictions];
    });
  };

  const addSubmitterRestriction = () => {
    setRestrictions((restrictions) => [...restrictions, { token, threshold }]);
  };

  if (progress === 0) {
    return (
      <TokenManager
        chainId={chainId}
        setIsModalOpen={setIsModalOpen}
        saveCallback={saveTokenCallback}
        existingTokens={restrictions.map(
          (restriction) => restriction?.token as IToken
        )}
        quickAddTokens={arraysSubtract(
          spaceTokens,
          restrictions.map((restriction) => restriction?.token as IToken)
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
          currentToken={token}
          currentThreshold={threshold}
          setCurrentThreshold={setThreshold}
        />
        <ModalActions
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            isEdit ? updateSubmitterRestriction() : addSubmitterRestriction();
            setIsModalOpen(false);
          }}
          confirmLabel="Save"
          cancelLabel="Cancel"
          confirmDisabled={!threshold || !(parseFloat(threshold) > 0)}
        />
      </>
    );
  }
  return null;
};

const ThresholdManager = ({
  currentToken,
  currentThreshold,
  setCurrentThreshold,
}: {
  currentToken: IToken;
  currentThreshold: string;
  setCurrentThreshold: React.Dispatch<any>;
}) => {
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentThreshold(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <label className="text-xl font-medium">Threshold</label>
        <div className="flex flex-row gap-2 items-center ml-auto">
          <p className="font-bold">{currentToken.symbol}</p>
          <TokenBadge token={currentToken} />
        </div>
      </div>
      <p className="text-t2">
        The minimum amount of tokens a user must hold to submit
      </p>
      <input
        className="input w-full  input-primary"
        type="number"
        value={currentThreshold || ""}
        onChange={handleThresholdChange}
      />
    </div>
  );
};

export default SubmitterRestrictions;
