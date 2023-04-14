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

type ERCOptions = "ERC20" | "ERC721" | "ERC1155";

type MenuOption = {
  value: ERCOptions;
  label: ERCOptions;
};

const defaultTokenOptions: MenuOption[] = [
  { value: "ERC20", label: "ERC20" },
  { value: "ERC721", label: "ERC721" },
  { value: "ERC1155", label: "ERC1155" },
];

type CustomTokenOption = IERCToken & {
  errors: {
    address: string | null;
    tokenId: string | null;
  };
};

type QuickAddTokenOption = IToken | null;

type TokenState = {
  customToken: CustomTokenOption;
  quickAddToken: QuickAddTokenOption;
};

type CustomTokenOptionErrors = CustomTokenOption["errors"];

const initialTokenState: TokenState = {
  customToken: {
    type: "ERC20",
    symbol: "",
    decimals: 0,
    address: "",
    errors: {
      address: null,
      tokenId: null,
    },
  },
  quickAddToken: null,
};

type TokenAction =
  | { type: "setCustomTokenType"; payload: ERCOptions }
  | { type: "setCustomToken"; payload: Partial<CustomTokenOption> }
  | { type: "setQuickAddToken"; payload: QuickAddTokenOption }
  | { type: "setCustomTokenErrors"; payload: Partial<CustomTokenOptionErrors> }
  | { type: "reset" };

const tokenReducer = (
  state: TokenState = initialTokenState,
  action: TokenAction
): TokenState => {
  switch (action.type) {
    case "setCustomTokenType":
      return {
        ...state,
        customToken: {
          ...initialTokenState.customToken,
          type: action.payload,
        },
      };
    case "setCustomToken":
      return {
        ...state,
        customToken: {
          ...state.customToken,
          ...action.payload,
          errors: {
            address: null,
            tokenId: null,
          },
        },
      };
    case "setQuickAddToken":
      return {
        ...state,
        quickAddToken: action.payload,
      };
    case "setCustomTokenErrors":
      return {
        ...state,
        customToken: {
          ...state.customToken,
          errors: {
            ...state.customToken.errors,
            ...action.payload,
          },
        },
      };
    case "reset": {
      return initialTokenState;
    }
    default:
      return state;
  }
};

const fetchSymbolAndDecimals = async (address: string, type: ERCOptions) => {
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
  quickAddTokens,
  uniqueStandard,
  strictTypes,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  callback: (token: IToken, actionType: "add" | "swap") => void;
  existingTokens: IToken[] | null;
  quickAddTokens: IToken[] | null;
  uniqueStandard: boolean;
  strictTypes?: ERCOptions[];
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [conflictingToken, setConflictingToken] = useState<IToken | null>(null);
  const tokenMenuOptions: MenuOption[] = strictTypes
    ? strictTypes.map((type) => ({
        value: type,
        label: type,
      }))
    : defaultTokenOptions;

  initialTokenState.customToken.type = tokenMenuOptions[0].value;

  console.log(initialTokenState);

  const [state, dispatch] = useReducer(tokenReducer, initialTokenState);

  const handleCloseAndReset = () => {
    setIsModalOpen(false);
    setProgress(0);
    setConflictingToken(null);
    dispatch({ type: "reset" });
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
      state.customToken.address.length === 42 &&
      state.customToken.address.startsWith("0x");

    // attempt to autofill the symbol and decimals if the address is valid
    if (isValidAddress)
      fetchSymbolAndDecimals(
        state.customToken.address,
        state.customToken.type
      ).then((res) => {
        res ? dispatch({ type: "setCustomToken", payload: res }) : null;
      });
    // reset the other fields if the address switched from valid to invalid
    else if (
      !isValidAddress &&
      state.customToken.symbol &&
      state.customToken.decimals
    ) {
      dispatch({
        type: "setCustomToken",
        payload: { symbol: "", decimals: 0 },
      });
    }
  }, [state.customToken.address]);

  const handleModalConfirm = async () => {
    if (progress === 1) {
      const isValidContract = await verifyTokenStandard({
        contractAddress: state.customToken.address,
        expectedStandard: state.customToken.type,
      });
      if (!isValidContract) {
        return dispatch({
          type: "setCustomTokenErrors",
          payload: {
            address: `This doesn't appear to be a valid ${state.customToken.type} address`,
          },
        });
      }
      if (state.customToken.type === "ERC1155") {
        if (!state.customToken.tokenId) {
          return dispatch({
            type: "setCustomTokenErrors",
            payload: {
              tokenId: "Please enter a valid token ID",
            },
          });
        } else {
          const isValidId = await isValidERC1155TokenId({
            contractAddress: state.customToken.address,
            tokenId: state.customToken.tokenId,
          });
          if (!isValidId) {
            return dispatch({
              type: "setCustomTokenErrors",
              payload: {
                tokenId: "Not a valid token ID for this contract",
              },
            });
          }
        }
      }
    }
    handleTokenConflicts();
  };

  /*
   * when existing tokens are passed in, conflicts occur in 2 forms
   * 1. the user is trying to add a token that already exists
   * 2. the user tries to add a token with the same type as an existing token.
   * case 2 is only checked when the uniqueStandard flag is set to true
   *
   */

  const handleTokenConflicts = () => {
    const currentToken = progress < 1 ? state.quickAddToken : state.customToken;

    if (existingTokens) {
      const tokenAlreadyExists = existingTokens.some((el) => {
        if (isERCToken(el)) {
          return JSON.stringify(el) === JSON.stringify(currentToken);
        }
      });

      if (tokenAlreadyExists) {
        return dispatch({
          type: "setCustomTokenErrors",
          payload: {
            address: "This token is already in your list",
          },
        });
      }

      // handle case 2
      if (uniqueStandard) {
        const tokenTypeAlreadyExists = existingTokens.some((el) => {
          if (isERCToken(el)) {
            return el.type === currentToken?.type;
          }
        });
        if (tokenTypeAlreadyExists) {
          setConflictingToken(currentToken as IToken);
          return setProgress(2);
        }
      }
    }

    callback(currentToken as IToken, "add"); // strip the errors from the token and pass to callback
    handleCloseAndReset();
  };

  const handleTokenSwap = () => {
    callback(conflictingToken as IToken, "swap");
    handleCloseAndReset();
  };

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full ">
        <div className="modal modal-open">
          <div ref={modalRef} className="modal-box bg-black/90">
            {progress === 0 && (
              <div className="w-full px-1 flex flex-col gap-2">
                <div className="flex flex-row items-center justify-evenly">
                  <div className="flex flex-col">
                    <h2 className="text-2xl">Quick Add</h2>
                    <QuickAddToken
                      quickAddTokens={quickAddTokens}
                      state={state}
                      dispatch={dispatch}
                    />
                  </div>
                  <div className="divider lg:divider-horizontal">
                    <ArrowPathIcon className="w-24" />
                  </div>
                  <button className="text-2xl" onClick={() => setProgress(1)}>
                    Manual Add
                  </button>
                </div>
              </div>
            )}
            {progress === 1 && (
              <div className="w-full px-1 flex flex-col gap-2">
                <div className="flex flex-row items-center">
                  <h2 className="text-2xl">Add a token</h2>
                  <div className="ml-auto">
                    <MenuSelect
                      options={tokenMenuOptions}
                      selected={{
                        value: state.customToken.type,
                        label: state.customToken.type,
                      }}
                      setSelected={(data) => {
                        dispatch({
                          type: "setCustomTokenType",
                          payload: data.value as CustomTokenOption["type"],
                        });
                      }}
                    />
                  </div>
                </div>
                {state.customToken.type === "ERC20" && (
                  <ERC20FormElement
                    token={state.customToken}
                    dispatch={dispatch}
                  />
                )}
                {state.customToken.type === "ERC721" && (
                  <ERC721FormElement
                    token={state.customToken}
                    dispatch={dispatch}
                  />
                )}
                {state.customToken.type === "ERC1155" && (
                  <ERC1155FormElement
                    token={state.customToken}
                    dispatch={dispatch}
                  />
                )}
              </div>
            )}
            {progress === 2 && conflictingToken && (
              // cases where we need to swap out the token standard
              <TokenSwap
                token={conflictingToken}
                existingTokens={existingTokens}
              />
            )}
            <div className="modal-action mt-8">
              <button onClick={handleCloseAndReset} className="btn mr-auto">
                Cancel
              </button>
              <button
                disabled={false}
                onClick={progress < 2 ? handleModalConfirm : handleTokenSwap}
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

const QuickAddToken = ({
  quickAddTokens,
  state,
  dispatch,
}: {
  quickAddTokens: IToken[] | null;
  state: TokenState;
  dispatch: React.Dispatch<TokenAction>;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter the tokens based on the search query
  const filteredTokens = quickAddTokens?.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="input input-bordered"
        placeholder="Search tokens..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {filteredTokens && filteredTokens.length > 0 ? (
        <ul className="menu menu-compact lg:menu-normal bg-base-100 w-56 p-2 rounded-box">
          {filteredTokens.map((el, index) => {
            return (
              <li key={index}>
                <a
                  className={`flex flex-row justify-between hover:bg-base-200 ${
                    JSON.stringify(state.quickAddToken) === JSON.stringify(el)
                      ? "bg-primary"
                      : "bg-base-100"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "setQuickAddToken",
                      payload: el,
                    });
                  }}
                >
                  <b>{el.symbol}</b>
                  {el.type}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="alert alert-warning shadow-lg">
          <p>hmm.. I couldn't find that token</p>
        </div>
      )}
    </div>
  );
};

const TokenSwap = ({
  token,
  existingTokens,
}: {
  token: IToken;
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
  token: CustomTokenOption;
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
        dispatch({ type: "setCustomToken", payload: { address: value } })
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
        dispatch({ type: "setCustomToken", payload: { symbol: value } })
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
        dispatch({
          type: "setCustomToken",
          payload: { decimals: Number(value) },
        })
      }
    />
  </div>
);

const ERC721FormElement = ({
  token,
  dispatch,
}: {
  token: CustomTokenOption;
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
        dispatch({
          type: "setCustomToken",
          payload: { address: value },
        })
      }
    />
    <InputField
      className="w-1/3"
      label="Symbol"
      type="text"
      disabled
      placeholder={token.symbol || "NOUN"}
      value={token.symbol}
      onChange={(value) =>
        dispatch({ type: "setCustomToken", payload: { symbol: value } })
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
        dispatch({
          type: "setCustomToken",
          payload: { decimals: Number(value) },
        })
      }
    />
  </div>
);

const ERC1155FormElement = ({
  token,
  dispatch,
}: {
  token: CustomTokenOption;
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
        dispatch({ type: "setCustomToken", payload: { address: value } })
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
          dispatch({ type: "setCustomToken", payload: { symbol: value } })
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
          dispatch({
            type: "setCustomToken",
            payload: { decimals: Number(value) },
          })
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
          type: "setCustomToken",
          payload: {
            tokenId: Number(value),
          },
        })
      }
    />
  </div>
);

export default TokenModal;
