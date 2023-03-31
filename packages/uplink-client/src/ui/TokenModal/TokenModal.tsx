import { useState, useRef, useEffect } from "react";
import MenuSelect from "../MenuSelect/MenuSelect";

const tokenOptions = [
  { value: "ERC20" },
  { value: "ERC721" },
  { value: "ERC1155" },
];

const TokenModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [selectedTokenType, setSelectedTokenType] = useState(tokenOptions[0]);

  const handleCloseAndReset = () => {
    setIsModalOpen(false);
    setProgress(0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseAndReset();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleModalConfirm = () => {};

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full ">
        <div className="modal modal-open">
          <div ref={modalRef} className="modal-box bg-black/90">
            <div className="w-full px-1 flex flex-col gap-2 items-center justify-center">
              <h2 className="text-xl">token select</h2>
              {progress === 0 && (
                <div className="flex flex-col w-64">
                  <MenuSelect
                    options={tokenOptions}
                    selected={selectedTokenType}
                    setSelected={setSelectedTokenType}
                  />
                  <TokenFormElement selected={selectedTokenType} />
                </div>
              )}
            </div>
            <div className="modal-action">
              <button onClick={handleCloseAndReset} className="btn mr-auto">
                Cancel
              </button>
              <button
                disabled={false}
                onClick={handleModalConfirm}
                className="btn"
              >
                {progress < 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        </div>
        <div className="fixed inset-0 bg-black opacity-50"></div>
      </div>
    );
  }
  return null;
};

const TokenFormElement = ({ selected }: { selected: { value: string } }) => {
  return (
    <div>
      <label className="block">
        <span className="text-gray-700">Token Name</span>
      </label>
      {selected.value === "ERC20" && <ERC20FormElement />}
    </div>
  );
};

const ERC20FormElement = () => {
  const [address, setAddress] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<string>("");

  return (
    <div className="flex flex-col mt-auto">
      <label className="text-sm p-1">Address</label>
      <input
        className="input"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </div>
  );
};

export default TokenModal;
