import { useState, useRef, useEffect, useReducer } from "react";
import MenuSelect from "../MenuSelect/MenuSelect";
import { IERCToken, isERCToken, IToken } from "@/types/token";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useTokenManager } from "@/hooks/useTokenManager";
import Modal, { ModalActions } from "../Modal/Modal";

import {
  ERCOptions,
  MenuOption,
  CustomTokenOption,
  TokenState,
  TokenAction,
} from "@/hooks/useTokenManager";

const TokenModal = ({
  isModalOpen,
  setIsModalOpen,
  saveCallback,
  existingTokens,
  quickAddTokens,
  continuous,
  uniqueStandard,
  strictTypes,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  saveCallback: (token: IToken) => void;
  existingTokens: IToken[] | null;
  quickAddTokens: IToken[] | null;
  continuous: boolean;
  uniqueStandard: boolean;
  strictTypes?: ERCOptions[];
}) => {
  if (isModalOpen)
    return (
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TokenManager
          setIsModalOpen={setIsModalOpen}
          saveCallback={saveCallback}
          existingTokens={existingTokens}
          quickAddTokens={quickAddTokens}
          continuous={continuous}
          uniqueStandard={uniqueStandard}
          strictTypes={strictTypes}
        />
      </Modal>
    );
  return null;
};

export const TokenManager = ({
  setIsModalOpen,
  saveCallback,
  existingTokens,
  quickAddTokens,
  continuous,
  uniqueStandard,
  strictTypes,
}: {
  setIsModalOpen: (isModalOpen: boolean) => void;
  saveCallback: (token: IToken) => void;
  existingTokens: IToken[] | null;
  quickAddTokens: IToken[] | null;
  continuous: boolean;
  uniqueStandard: boolean;
  strictTypes?: ERCOptions[];
}) => {
  const handleCloseAndReset = () => {
    /*
    setIsModalOpen(false);
    setProgress(0);
    setConflictingToken(null);
    dispatch({ type: "reset" });
    */
    setIsModalOpen(false);
  };

  const {
    progress,
    setProgress,
    tokenMenuOptions,
    state,
    dispatch,
    handleModalConfirm,
    handleAddToken,
  } = useTokenManager({
    existingTokens: existingTokens,
    uniqueStandard: uniqueStandard,
    saveCallback: saveCallback,
    handleClose: () => setIsModalOpen(false),
    continuous: continuous,
  });

  if (progress === 0)
    return (
      <>
        <QuickAddToken
          quickAddTokens={quickAddTokens}
          state={state}
          dispatch={dispatch}
          setProgress={setProgress}
        />
        <ModalActions
          onCancel={handleCloseAndReset}
          onConfirm={handleModalConfirm}
          confirmLabel="Confirm"
        />
      </>
    );

  if (progress === 1)
    return (
      <>
        <ManualAddToken
          state={state}
          dispatch={dispatch}
          tokenMenuOptions={tokenMenuOptions}
        />
        <ModalActions
          onCancel={handleCloseAndReset}
          onConfirm={handleModalConfirm}
          confirmLabel="Confirm"
        />
      </>
    );

  if (progress === 2)
    return (
      <>
        <TokenSwap
          token={state.quickAddToken || state.customToken}
          existingTokens={existingTokens}
        />
        <ModalActions
          onCancel={handleCloseAndReset}
          onConfirm={handleAddToken}
          confirmLabel="Swap"
        />
      </>
    );

  return null;
};

const QuickAddToken = ({
  quickAddTokens,
  state,
  dispatch,
  setProgress,
}: {
  quickAddTokens: IToken[] | null;
  state: TokenState;
  dispatch: React.Dispatch<TokenAction>;
  setProgress: (progress: number) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter the tokens based on the search query
  const filteredTokens = quickAddTokens?.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full px-1 gap-4">
      <h2 className="text-2xl">Quick Add</h2>
      <input
        type="text"
        className="input input-bordered"
        placeholder="Search tokens..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {filteredTokens && filteredTokens.length > 0 ? (
        <ul className="menu menu-compact lg:menu-normal bg-base-100 w-full p-2 rounded-box">
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
        <div className="alert alert-warning justify-start shadow-lg">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <p>hmm.. I couldn't find that token</p>
        </div>
      )}
      <button
        className="btn btn-normal btn-secondary"
        onClick={() => setProgress(1)}
      >
        Manual Add
        <PlusIcon className="ml-2 w-6" />
      </button>
    </div>
  );
};

const ManualAddToken = ({
  state,
  dispatch,
  tokenMenuOptions,
}: {
  state: TokenState;
  dispatch: React.Dispatch<TokenAction>;
  tokenMenuOptions: MenuOption[];
}) => {
  return (
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
        <ERC20FormElement token={state.customToken} dispatch={dispatch} />
      )}
      {state.customToken.type === "ERC721" && (
        <ERC721FormElement token={state.customToken} dispatch={dispatch} />
      )}
      {state.customToken.type === "ERC1155" && (
        <ERC1155FormElement token={state.customToken} dispatch={dispatch} />
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
