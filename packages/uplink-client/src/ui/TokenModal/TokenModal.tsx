import { useState, useRef, useEffect, useReducer } from "react";
import MenuSelect from "../MenuSelect/MenuSelect";
import {
  isValidERC1155TokenId,
  tokenGetSymbolAndDecimal,
  verifyTokenStandard,
} from "@/lib/contract";

const tokenOptions = [
  { value: "ERC20" },
  { value: "ERC721" },
  { value: "ERC1155" },
];

interface IERCToken {
  type: "ERC20" | "ERC721" | "ERC1155";
  address: string;
  symbol: string;
  decimals: number;
  tokenId: number | null;
  errors: {
    address: string | null;
    tokenId: string | null;
  };
}

const initialTokenState: IERCToken = {
  type: "ERC20",
  address: "",
  symbol: "",
  decimals: 0,
  tokenId: null,
  errors: {
    address: null,
    tokenId: null,
  },
};

type SetTokenTypeAction = {
  type: "setTokenType";
  payload: IERCToken["type"];
};

type SetTokenAction = {
  type: "setToken";
  payload: Partial<IERCToken>;
};

type SetTokenErrorsAction = {
  type: "setTokenErrors";
  payload: Partial<IERCToken["errors"]>;
};

type TokenAction = SetTokenTypeAction | SetTokenAction | SetTokenErrorsAction;

const tokenReducer = (state: IERCToken, action: TokenAction): IERCToken => {
  switch (action.type) {
    case "setTokenType":
      return {
        ...initialTokenState,
        type: action.payload,
      };
    case "setToken":
      // remove all the errors
      const { errors, ...rest } = state;
      return {
        ...rest,
        ...action.payload,
        errors: {
          address: null,
          tokenId: null,
        },
      };
    case "setTokenErrors":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

const fetchSymbolAndDecimals = async (
  address: IERCToken["address"],
  type: IERCToken["type"]
) => {
  try {
    return await tokenGetSymbolAndDecimal({
      contractAddress: address,
      tokenStandard: type,
    });
  } catch (err) {
    console.log(err);
  }
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

  useEffect(() => {
    const isValidAddress =
      token.address.length === 42 && token.address.startsWith("0x");

    // attempt to autofill the symbol and decimals if the address is valid
    if (isValidAddress)
      fetchSymbolAndDecimals(token.address, token.type).then((res) => {
        res ? dispatch({ type: "setToken", payload: res }) : null;
      });
    // reset the other fields if the address switched from valid to invalid
    else if (!isValidAddress && token.symbol && token.decimals) {
      dispatch({ type: "setToken", payload: { symbol: "", decimals: 0 } });
    }
  }, [token.address]);

  const handleModalConfirm = async () => {
    const isValidContract = await verifyTokenStandard({
      contractAddress: token.address,
      expectedStandard: token.type,
    });
    if (!isValidContract) {
      dispatch({
        type: "setTokenErrors",
        payload: {
          address: `This doesn't appear to be a valid ${token.type} address`,
        },
      });
    }
    if (token.type === "ERC1155") {
      if (!token.tokenId) {
        dispatch({
          type: "setTokenErrors",
          payload: {
            tokenId: "Please enter a valid token ID",
          },
        });
      } else {
        const isValidId = await isValidERC1155TokenId({
          contractAddress: token.address,
          tokenId: token.tokenId,
        });
        if (!isValidId) {
          dispatch({
            type: "setTokenErrors",
            payload: {
              tokenId: "Not a valid token ID for this contract",
            },
          });
        }
      }
    }
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
                          type: "setTokenType",
                          payload: data.value as IERCToken["type"],
                        });
                      }}
                    />
                  </div>
                </div>
                {token.type === "ERC20" && (
                  <ERC20FormElement token={token} dispatch={dispatch} />
                )}
                {token.type === "ERC721" && (
                  <ERC721FormElement token={token} dispatch={dispatch} />
                )}
                {token.type === "ERC1155" && (
                  <ERC1155FormElement token={token} dispatch={dispatch} />
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
  token: IERCToken;
  dispatch: React.Dispatch<TokenAction>;
}) => {
  return (
    <div className="flex flex-col mt-auto w-full gap-4">
      <div className="flex flex-col">
        <label className="text-sm p-1">Address</label>
        <input
          className={`input ${
            token.errors.address ? "input-error" : "input-primary"
          }`}
          type="text"
          placeholder="0x"
          value={token.address}
          onChange={(e) =>
            dispatch({ type: "setToken", payload: { address: e.target.value } })
          }
        />
        {token.errors.address && (
          <label className="label">
            <span className="label-text-alt text-error">
              {token.errors.address}
            </span>
          </label>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm p-1">Symbol</label>
        <input
          className="input w-1/3"
          type="text"
          disabled
          placeholder={token.symbol || "SHARK"}
          onChange={(e) =>
            dispatch({ type: "setToken", payload: { symbol: e.target.value } })
          }
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm p-1">Decimal</label>
        <input
          className="input w-1/3"
          type="number"
          disabled
          placeholder={token.decimals.toString()}
          onChange={(e) =>
            dispatch({
              type: "setToken",
              payload: { decimals: Number(e.target.value) },
            })
          }
        />
      </div>
    </div>
  );
};

const ERC721FormElement = ({
  token,
  dispatch,
}: {
  token: IERCToken;
  dispatch: React.Dispatch<TokenAction>;
}) => {
  return (
    <div className="flex flex-col mt-auto w-full gap-4">
      <div className="flex flex-col">
        <label className="text-sm p-1">Address</label>
        <input
          className={`input ${
            token.errors.address ? "input-error" : "input-primary"
          }`}
          type="text"
          placeholder="0x"
          value={token.address}
          onChange={(e) =>
            dispatch({ type: "setToken", payload: { address: e.target.value } })
          }
        />
        {token.errors.address && (
          <label className="label">
            <span className="label-text-alt text-error">
              {token.errors.address}
            </span>
          </label>
        )}
      </div>
      <div className="flex flex-col w-1/3">
        <label className="text-sm p-1">Symbol</label>
        <input
          className="input"
          type="text"
          disabled
          placeholder={token.symbol || "NOUNS"}
          onChange={(e) =>
            dispatch({ type: "setToken", payload: { symbol: e.target.value } })
          }
        />
      </div>
      <div className="flex flex-col w-1/3">
        <label className="text-sm p-1">Decimal</label>
        <input
          className="input"
          type="number"
          disabled
          placeholder={token.decimals.toString()}
          onChange={(e) =>
            dispatch({
              type: "setToken",
              payload: { decimals: Number(e.target.value) },
            })
          }
        />
      </div>
    </div>
  );
};

const ERC1155FormElement = ({
  token,
  dispatch,
}: {
  token: IERCToken;
  dispatch: React.Dispatch<TokenAction>;
}) => {
  return (
    <div className="flex flex-col mt-auto w-full gap-4">
      <div className="flex flex-col">
        <label className="text-sm p-1">Address</label>
        <input
          className={`input ${
            token.errors.address ? "input-error" : "input-primary"
          }`}
          type="text"
          placeholder="0x"
          value={token.address}
          onChange={(e) =>
            dispatch({ type: "setToken", payload: { address: e.target.value } })
          }
        />
        {token.errors.address && (
          <label className="label">
            <span className="label-text-alt text-error">
              {token.errors.address}
            </span>
          </label>
        )}
      </div>
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col w-1/3">
          <label className="text-sm p-1">Symbol</label>
          <input
            className="input"
            type="text"
            value={token.symbol}
            placeholder="SHARK"
            onChange={(e) =>
              dispatch({
                type: "setToken",
                payload: { symbol: e.target.value },
              })
            }
          />
        </div>
        <div className="flex flex-col w-1/3">
          <label className="text-sm p-1">Decimal</label>
          <input
            className="input"
            type="number"
            disabled
            placeholder="0"
            onChange={(e) =>
              dispatch({
                type: "setToken",
                payload: { decimals: Number(e.target.value) },
              })
            }
          />
        </div>
      </div>
      <div className="flex flex-col w-1/3">
        <label className="text-sm p-1">Token Id</label>
        <input
          className={`input ${
            token.errors.tokenId ? "input-error" : "input-primary"
          }`}
          type="number"
          value={token.tokenId === null ? "" : token.tokenId}
          placeholder="18"
          onChange={(e) =>
            dispatch({
              type: "setToken",
              payload: {
                tokenId: e.target.value === "" ? null : Number(e.target.value),
              },
            })
          }
        />
        {token.errors.tokenId && (
          <label className="label">
            <span className="label-text-alt text-error">
              {token.errors.tokenId}
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default TokenModal;
