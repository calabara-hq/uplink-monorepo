import { useState, useRef, useEffect, useReducer } from "react";
import MenuSelect from "../MenuSelect/MenuSelect";
import {
  isValidERC1155TokenId,
  tokenGetSymbolAndDecimal,
  verifyTokenStandard,
} from "@/lib/contract";
import { IERCToken, isERCToken, IToken } from "@/types/token";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const tokenOptions = [
  { value: "ERC20" },
  { value: "ERC721" },
  { value: "ERC1155" },
];

type ERCTokenOption = IERCToken & {
  errors: {
    address: string | null;
    tokenId: string | null;
  };
};

const initialTokenState: ERCTokenOption = {
  type: "ERC20",
  address: "",
  symbol: "",
  decimals: 0,
  errors: {
    address: null,
    tokenId: null,
  },
};

type SetTokenTypeAction = {
  type: "setTokenType";
  payload: ERCTokenOption["type"];
};

type SetTokenAction = {
  type: "setToken";
  payload: Partial<ERCTokenOption>;
};

type SetTokenErrorsAction = {
  type: "setTokenErrors";
  payload: Partial<ERCTokenOption["errors"]>;
};

type TokenAction = SetTokenTypeAction | SetTokenAction | SetTokenErrorsAction;

const tokenReducer = (
  state: ERCTokenOption,
  action: TokenAction
): ERCTokenOption => {
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
  address: ERCTokenOption["address"],
  type: ERCTokenOption["type"]
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
  callback,
  existingTokens,
  strictStandard,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  callback: (token: IToken, actionType: "add" | "swap") => void;
  existingTokens: IToken[] | null;
  strictStandard: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [token, dispatch] = useReducer(tokenReducer, initialTokenState);

  const handleCloseAndReset = () => {
    setIsModalOpen(false);
    setProgress(0);
    dispatch({ type: "setToken", payload: initialTokenState });
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
      return dispatch({
        type: "setTokenErrors",
        payload: {
          address: `This doesn't appear to be a valid ${token.type} address`,
        },
      });
    }
    if (token.type === "ERC1155") {
      if (!token.tokenId) {
        return dispatch({
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
          return dispatch({
            type: "setTokenErrors",
            payload: {
              tokenId: "Not a valid token ID for this contract",
            },
          });
        }
      }
    }
    handleTokenConflicts();
  };

  /*
   * when existing tokens are passed in, conflicts occur in 2 forms
   * 1. the user is trying to add a token that already exists
   * 2. the user tries to add a token with the same type as an existing token.
   * case 2 is only checked when the strictStandard flag is set to true
   */
  const handleTokenConflicts = () => {
    if (existingTokens) {
      const ERCTokens = existingTokens.filter((token) => token.type !== "ETH");

      // handle case 1. ignore the ETH token
      const tokenAlreadyExists = ERCTokens.some((el) => {
        if (isERCToken(el)) {
          return (
            el.address.toLowerCase() === token.address.toLowerCase() &&
            el.tokenId === token.tokenId
          );
        }
      });
      if (tokenAlreadyExists) {
        return dispatch({
          type: "setTokenErrors",
          payload: {
            address: "This token is already in your list",
          },
        });
      }

      // handle case 2
      if (strictStandard) {
        const tokenTypeAlreadyExists = ERCTokens.some((el) => {
          if (isERCToken(el)) {
            return el.type === token.type;
          }
        });
        if (tokenTypeAlreadyExists) {
          return setProgress(1);
        }
      }
    }

    const { errors, ...rest } = token;
    callback(rest, "add");
    handleCloseAndReset();
  };

  const handleTokenSwap = () => {
    const { errors, ...rest } = token;
    callback(rest, "swap");
    handleCloseAndReset();
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
                    <MenuSelect
                      options={tokenOptions}
                      selected={{ value: token.type }}
                      setSelected={(data) => {
                        dispatch({
                          type: "setTokenType",
                          payload: data.value as ERCTokenOption["type"],
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
            {progress === 1 && (
              // cases where we need to swap out the token standard
              <TokenSwap token={token} existingTokens={existingTokens} />
            )}
            <div className="modal-action mt-8">
              <button onClick={handleCloseAndReset} className="btn mr-auto">
                Cancel
              </button>
              <button
                disabled={false}
                onClick={progress === 0 ? handleModalConfirm : handleTokenSwap}
                className="btn btn-primary"
              >
                {progress === 0 ? "Confirm" : "Swap"}
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

const TokenSwap = ({
  token,
  existingTokens,
}: {
  token: ERCTokenOption;
  existingTokens: IToken[] | null;
}) => {
  return (
    <div className="w-full px-1 flex flex-col gap-4">
      <div className="alert alert-warning shadow-lg">
        <div>
          <span>
            <ExclamationTriangleIcon className="w-6" />
          </span>
          <span>
            You already have <b>1</b> {token.type} token in your list. To use
            the new token, select <b>swap</b>. To revert, select <b>cancel</b>
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full lg:flex-row gap-2">
        <div className="relative flex-grow h-32 card bg-base-300 rounded-box justify-center items-center">
          <div className="absolute top-0 left-0 bg-info text-xs text-black px-1 py-0.5 rounded-br-md rounded-tl-md">
            Existing
          </div>
          <h2 className="font-bold">
            {existingTokens?.find((el) => el.type === token.type)?.symbol}
          </h2>
        </div>
        <div className="divider lg:divider-horizontal">
          <ArrowPathIcon className="w-24" />
        </div>
        <div className="relative flex-grow h-32 card bg-base-300 rounded-box justify-center items-center">
          <div className="absolute top-0 left-0 bg-success text-xs text-black px-1 py-0.5 rounded-br-md rounded-tl-md">
            Proposed
          </div>
          <h2 className="font-bold">{token.symbol}</h2>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  className,
  type,
  placeholder,
  value,
  disabled,
  error,
  onChange,
}: {
  label: string;
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  error?: string | null;
  onChange: (value: string) => void;
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm p-1">{label}</label>
    <input
      className={`input ${error ? "input-error" : "input-primary"}`}
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    )}
  </div>
);

const ERC20FormElement = ({
  token,
  dispatch,
}: {
  token: ERCTokenOption;
  dispatch: React.Dispatch<TokenAction>;
}) => (
  <div className="flex flex-col mt-auto w-full gap-4">
    <InputField
      label="Address"
      type="text"
      placeholder="0x"
      value={token.address}
      error={token.errors.address}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { address: value } })
      }
    />
    <InputField
      className="w-1/3"
      label="Symbol"
      type="text"
      disabled
      placeholder={token.symbol || "SHARK"}
      value={token.symbol}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { symbol: value } })
      }
    />
    <InputField
      className="w-1/3"
      label="Decimals"
      type="number"
      disabled
      placeholder={token.decimals.toString()}
      value={token.decimals.toString()}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { decimals: Number(value) } })
      }
    />
  </div>
);

const ERC721FormElement = ({
  token,
  dispatch,
}: {
  token: ERCTokenOption;
  dispatch: React.Dispatch<TokenAction>;
}) => (
  <div className="flex flex-col mt-auto w-full gap-4">
    <InputField
      label="Address"
      type="text"
      placeholder="0x"
      value={token.address}
      error={token.errors.address}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { address: value } })
      }
    />
    <InputField
      className="w-1/3"
      label="Symbol"
      type="text"
      disabled
      placeholder={token.symbol || "NOUNS"}
      value={token.symbol}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { symbol: value } })
      }
    />
    <InputField
      className="w-1/3"
      label="Decimals"
      type="number"
      disabled
      placeholder={token.decimals.toString()}
      value={token.decimals.toString()}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { decimals: Number(value) } })
      }
    />
  </div>
);

const ERC1155FormElement = ({
  token,
  dispatch,
}: {
  token: ERCTokenOption;
  dispatch: React.Dispatch<TokenAction>;
}) => (
  <div className="flex flex-col mt-auto w-full gap-4">
    <InputField
      label="Address"
      type="text"
      placeholder="0x"
      value={token.address}
      error={token.errors.address}
      onChange={(value) =>
        dispatch({ type: "setToken", payload: { address: value } })
      }
    />
    <div className="flex flex-row w-full gap-4">
      <InputField
        className="w-1/3"
        label="Symbol"
        type="text"
        placeholder="SHARK"
        value={token.symbol}
        onChange={(value) =>
          dispatch({ type: "setToken", payload: { symbol: value } })
        }
      />
      <InputField
        className="w-1/3"
        label="Decimals"
        type="number"
        disabled
        placeholder="0"
        value="0"
        onChange={(value) =>
          dispatch({ type: "setToken", payload: { decimals: Number(value) } })
        }
      />
    </div>
    <InputField
      className="w-1/3"
      label="Token Id"
      type="number"
      placeholder="18"
      value={token.tokenId?.toString() ?? ""}
      error={token.errors.tokenId}
      onChange={(value) =>
        dispatch({
          type: "setToken",
          payload: {
            tokenId: Number(value),
          },
        })
      }
    />
  </div>
);

export default TokenModal;
