"use client";

import { ThreadItem } from "@/hooks/useThreadCreator";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { useSession } from "@/providers/SessionProvider";
import { AddressOrEns, UserAvatar } from "@/ui/AddressDisplay/AddressDisplay";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import CreateThread from "@/ui/CreateThread/CreateThread";
import { ModalActions } from "@/ui/Modal/Modal";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { HiCheckBadge, HiXCircle } from "react-icons/hi2";

// refactored version of twitter submit

const Modal = ({
  isModalOpen,
  children,
  onClose,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (
  //         modalRef.current &&
  //         !modalRef.current.contains(event.target as Node)
  //       ) {
  //         onClose();
  //       }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [modalRef]);

  if (isModalOpen) {
    return (
      <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
        <div
          ref={modalRef}
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-2xl animate-springUp"
        >
          {children}
        </div>
      </div>
    );
  }
  return null;
};

const Stage0 = ({ handlePrev, handleNext }) => {
  const { data: session, status } = useSession();
  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } =
    useContestInteractionState();
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl text-t1 text-center font-semibold">Welcome!</h2>
        <h3 className="text-lg text-t1 text-center ">
          {`To start, lets make sure you're eligible to submit to this contest.`}
        </h3>

        <div className="grid grid-cols-2 gap-4 pl-4 pr-4 ">
          <div></div>
          <div className="flex flex-col items-center justify-center">
            <WalletConnectButton />
          </div>
        </div>

        {/* {status !== "authenticated" && (
          <div className="w-64">
            <WalletConnectButton />
          </div>
        )}

        {status === "authenticated" && (
          <div className="grid grid-cols-2 gap-4 pl-4 pr-4 ">
            <div className="flex flex-col items-center justify-center">
              {isLoading ? (
                <div
                  className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              ) : (
                <div className="grid grid-cols-1">
                  {userSubmitParams.restrictionResults.map((el, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`flex flex-row gap-2 items-center text-sm text-t2 animate-springUp delay-${
                          idx * 100
                        }`}
                      >
                        <p>
                          {el.restriction.tokenRestriction.threshold.toString()}{" "}
                          {el.restriction.tokenRestriction.token.symbol}
                        </p>
                        {el.result === true ? (
                          <HiCheckBadge className="text-success w-4 h-4 ml-auto" />
                        ) : (
                          <HiXCircle className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                  <p>hello</p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <UserAvatar address={session?.user?.address} size={60} />
              <AddressOrEns address={session?.user?.address} />
            </div>
          </div>
        )} */}

        {/* <WalletConnectButton>
            <div className="flex flex-col gap-2">

        </WalletConnectButton> */}
      </div>
      {/* <ModalActions
        onCancel={handlePrev}
        onConfirm={handleNext}
        confirmLabel="Next"
        cancelLabel="Back"
      /> */}
    </div>
  );
};

const FormStageWrapper = ({ handlePrev, handleNext, children }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-4">{children}</div>
      <ModalActions
        onCancel={handlePrev}
        onConfirm={handleNext}
        confirmLabel="Next"
        cancelLabel="Back"
      />
    </div>
  );
};

const TwitterSubmit = ({
  params,
}: {
  params: { id: string; name: string };
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const [formStage, setFormStage] = useState(0);
  const [thread, setThread] = useState<ThreadItem[]>([
    {
      id: nanoid(),
      text: "",
      primaryAssetUrl: null,
      primaryAssetBlob: null,
      videoThumbnailUrl: null,
      videoThumbnailBlobIndex: null,
      videoThumbnailOptions: null,
      assetSize: null,
      assetType: null,
      isVideo: false,
      isUploading: false,
    },
  ]);
  const numStages = 2;

  const handleNext = () => {
    if (formStage === 2) {
      setIsModalOpen(false);
      setIsCreateThreadModalOpen(true);
      return;
    }
    if (formStage < numStages) {
      setFormStage(formStage + 1);
    }
  };

  const handlePrev = () => {
    if (formStage === 3) {
      setIsCreateThreadModalOpen(false);
      setIsModalOpen(true);
      return;
    }
    if (formStage > 0) {
      setFormStage(formStage - 1);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
        Lets go
      </button>
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {formStage === 0 && <Stage0 {...{ handlePrev, handleNext }} />}
      </Modal>
      <CreateThread
        isModalOpen={isCreateThreadModalOpen}
        setIsModalOpen={setIsCreateThreadModalOpen}
        initialThread={thread}
        confirmLabel="save thread"
        onConfirm={(thread) => {
          setThread(thread);
          //setIsPreviewModalOpen(true);
        }}
      />
    </div>
  );
};

export default TwitterSubmit;
