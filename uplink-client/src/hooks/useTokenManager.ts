import { useState, useReducer, useEffect } from "react";
import {
    isValidERC1155TokenId,
    tokenGetSymbolAndDecimal,
    verifyTokenStandard,
} from "@/lib/contract";
import { IERCToken, INativeToken, isERCToken, isNativeToken, IToken } from "@/types/token";

export type ERCOptions = "ERC20" | "ERC721" | "ERC1155";

export type MenuOption = {
    value: ERCOptions;
    label: ERCOptions;
};

export const defaultTokenOptions: MenuOption[] = [
    { value: "ERC20", label: "ERC20" },
    { value: "ERC721", label: "ERC721" },
    { value: "ERC1155", label: "ERC1155" },
];

export type CustomTokenOption = IERCToken & {
    errors: {
        address: string | null;
        tokenId: string | null;
    };
};

export type QuickAddTokenOption = IToken | null;

export type TokenState = {
    customToken: CustomTokenOption;
    quickAddToken: QuickAddTokenOption;
};

export type CustomTokenOptionErrors = CustomTokenOption["errors"];


interface UseTokenManagerOptions {
    existingTokens: IToken[] | null;
    uniqueStandard: boolean;
    saveCallback: (token: IToken) => void;
    handleClose: () => void;
    continuous: boolean;
    strictTypes?: ERCOptions[];
}

const initialTokenState: TokenState = {
    customToken: {
        type: "ERC20",
        symbol: "",
        decimals: 0,
        address: "",
        tokenId: null,
        errors: {
            address: null,
            tokenId: null,
        },
    },
    quickAddToken: null,
};

export type TokenAction =
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
            const token = isNativeToken(action.payload) ? { type: "ETH", symbol: "ETH", decimals: 18 } as INativeToken : action.payload;
            return {
                ...state,
                quickAddToken: token,
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


/**
 * useTokenManager handles all logic related to adding a token
 * it can also be used in continuous mode, where it will not reset after adding a token
 */


export const useTokenManager = ({
    existingTokens,
    uniqueStandard,
    saveCallback,
    handleClose,
    continuous,
    strictTypes,
}: UseTokenManagerOptions) => {
    const [progress, setProgress] = useState<number>(0);
    const tokenMenuOptions: MenuOption[] = strictTypes
        ? strictTypes.map((type) => ({
            value: type,
            label: type,
        }))
        : defaultTokenOptions;

    initialTokenState.customToken.type = tokenMenuOptions[0].value;

    const [state, dispatch] = useReducer(tokenReducer, initialTokenState);




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
        const currentToken = state.quickAddToken || state.customToken as IERCToken;

        if (existingTokens) {

            for (const existingToken of existingTokens) {

                if (isERCToken(existingToken) && isERCToken(currentToken)) {
                    if (existingToken.address === currentToken.address) {
                        if (currentToken.type === "ERC1155") {
                            // set tokenid error
                            return dispatch({
                                type: "setCustomTokenErrors",
                                payload: {
                                    tokenId: "This token id is already in your list",
                                },
                            });
                        }
                        else {
                            return dispatch({
                                type: "setCustomTokenErrors",
                                payload: {
                                    address: "This token is already in your list",
                                },
                            });
                        }
                    }
                }
            }

            // handle case 2
            if (uniqueStandard) {
                const tokenTypeAlreadyExists = existingTokens.some((el) => {
                    if (isERCToken(el)) {
                        return el.type === currentToken?.type;
                    }
                });
                if (tokenTypeAlreadyExists) {
                    return setProgress(2);
                }
            }
        }

        handleAddToken();
    };

    const handleAddToken = () => {
        const { errors, ...customToken } = state.customToken;
        const currentToken = state.quickAddToken || customToken;
        saveCallback(currentToken);
        if (!continuous) return handleClose();
    };


    return {
        progress,
        setProgress,
        tokenMenuOptions,
        state,
        dispatch,
        handleModalConfirm,
        handleTokenConflicts,
        handleAddToken,
    };
};
