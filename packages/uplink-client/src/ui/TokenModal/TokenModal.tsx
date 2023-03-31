import { useState, useRef, useEffect, useReducer } from "react";
import MenuSelect from "../MenuSelect/MenuSelect";
import { IToken } from "@/app/contestbuilder/contestHandler";
import { tokenGetSymbolAndDecimal } from "@/lib/contract";

const tokenOptions = [
  { value: "ERC20" },
  { value: "ERC721" },
  { value: "ERC1155" },
];

const initialTokenState: IToken = {
  type: "ERC20",
  address: "",
  symbol: "",
  decimals: 0,
};

type TokenAction = {
  type: "setToken";
  payload: Partial<IToken>;
};

const tokenReducer = (state: IToken, action: TokenAction): IToken => {
  return action.type === "setToken" ? { ...state, ...action.payload } : state;
  /*
  switch (action.type) {
    case "setToken":
      return { ...state, ...action.payload };
    default:
      return state;
  }
  */
};

const TokenModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [token, dispatch] = useReducer(tokenReducer, initialTokenState);

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

  const attemptAutofill = async () => {
    const [symbol, decimals] = await tokenGetSymbolAndDecimal({
      contractAddress: token.address,
      tokenStandard: token.type,
    });
    dispatch({ type: "setToken", payload: { symbol, decimals } });
  };

  // if address looks like an eth address, try to get the other fields
  useEffect(() => {
    if (token.address.length === 42 && token.address.startsWith("0x")) {
      attemptAutofill();
    }
  }, [token.address]);

  const handleModalConfirm = () => {
    console.log(token);
  };

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full ">
        <div className="modal modal-open">
          <div ref={modalRef} className="modal-box bg-black/90">
            {progress === 0 && (
              <div className="w-full px-1 flex flex-col gap-2">
                <div className="flex flex-row items-center">
                  <h2 className="text-2xl">Add a token</h2>
                  <div className="ml-auto">
                    <label className="text-sm p-1">Type</label>
                    <MenuSelect
                      options={tokenOptions}
                      selected={{ value: token.type }}
                      setSelected={(data) => {
                        dispatch({
                          type: "setToken",
                          payload: { type: data.value },
                        });
                      }}
                    />
                  </div>
                </div>
                {token.type === "ERC20" && (
                  <ERC20FormElement token={token} dispatch={dispatch} />
                )}
              </div>
            )}
            <div className="modal-action mt-8">
              <button onClick={handleCloseAndReset} className="btn mr-auto">
                Cancel
              </button>
              <button
                disabled={false}
                onClick={handleModalConfirm}
                className="btn btn-primary"
              >
                Confirm
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

const ERC20FormElement = ({
  token,
  dispatch,
}: {
  token: IToken;
  dispatch: React.Dispatch<TokenAction>;
}) => {
  return (
    <div className="flex flex-col mt-auto w-full gap-4">
      <label className="text-sm p-1">Address</label>
      <input
        className="input"
        type="text"
        placeholder="0x"
        value={token.address}
        onChange={(e) =>
          dispatch({ type: "setToken", payload: { address: e.target.value } })
        }
      />
      <label className="text-sm p-1">Symbol</label>
      <input
        className="input w-1/3"
        type="text"
        disabled
        value={token.symbol}
        placeholder="SHARK"
        onChange={(e) =>
          dispatch({ type: "setToken", payload: { symbol: e.target.value } })
        }
      />
      <label className="text-sm p-1">Decimal</label>
      <input
        className="input w-1/3"
        type="number"
        disabled
        value={token.decimals}
        placeholder="18"
        onChange={(e) =>
          dispatch({
            type: "setToken",
            payload: { decimals: Number(e.target.value) },
          })
        }
      />
    </div>
  );
};

export default TokenModal;
