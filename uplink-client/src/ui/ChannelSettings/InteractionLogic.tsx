"use client";;
import { useReducer, useState } from "react";
import { z } from "zod";
import { FieldError, SectionWrapper } from "./Utils";
import { Label } from "../DesignKit/Label";
import { UniformInteractionPower, validateSetupActions, WeightedInteractionPower } from "@tx-kit/sdk/utils";
import { DynamicLogicInputs, getDynamicLogicAddress, NATIVE_TOKEN } from "@tx-kit/sdk";
import { Button } from "../DesignKit/Button";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { HiPencil } from "react-icons/hi2";
import { Address, encodeAbiParameters, parseUnits, zeroAddress } from "viem";
import { Input } from "../DesignKit/Input";
import { asPositiveFloat } from "@/ui/MintboardSettings/MintboardSettings";
import { asPositiveInt } from "../Studio/StudioTools";
import { Info } from "../DesignKit/Info";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../DesignKit/Dialog";
import { useManagedTokenEditor } from "@/hooks/useTokenManager";
import { AddToken } from "../ManageTokenModal/ManageTokenModal";
import { ChainId } from "@/types/chains";
import { getTokenInfo } from "@/lib/tokenInfo";

const singleLogicRuleSchema = z.object({
    chainId: z.union([z.literal(8453), z.literal(84532)]),
    targetType: z.literal("balanceOf"),
    target: z.string().min(1, { message: "Target is required" }),
    signature: z.string().min(1, { message: "Signature is required" }),
    operator: z.union([z.literal("lt"), z.literal("gt"), z.literal("eq")]),
    data: z.string(),
    literalOperand: z.string().min(1, { message: "Literal operand is required" }),
    interactionPowerType: z.union([z.literal("uniform"), z.literal("dynamic")]),
    interactionPower: z.string().min(1, { message: "Interaction power is required" }),
}).transform(async (input, ctx) => {
    const fetchTokenDecimals = async (token: string) => {
        if (token === NATIVE_TOKEN) return 18;
        const { decimals } = await getTokenInfo({ contractAddress: token as Address, chainId: input.chainId })
        return decimals;
    }

    const buildInteractionPower = (type: string, value: string): UniformInteractionPower | WeightedInteractionPower => {
        if (type === "uniform") {
            return new UniformInteractionPower(BigInt(value));
        }
        else {
            return new WeightedInteractionPower();
        }
    }

    const buildReadOperation = async (
        baseRule: UniformInteractionPower | WeightedInteractionPower,
        operator: string,
        literalOperand: string,
        target: string,
        signature: string,
        data: string
    ): Promise<DynamicLogicInputs> => {
        const decimals = await fetchTokenDecimals(target);
        if (operator === "lt") return baseRule.ifResultOf(target, signature, data).lt(parseUnits(literalOperand, decimals));
        else if (operator === "eq") return baseRule.ifResultOf(target, signature, data).eq(parseUnits(literalOperand, decimals));
        else return baseRule.ifResultOf(target, signature, data).gt(parseUnits(literalOperand, decimals));
    }

    const interactionPower = buildInteractionPower(input.interactionPowerType, input.interactionPower);
    const logic = buildReadOperation(interactionPower, input.operator, input.literalOperand, input.target, input.signature, input.data);

    return logic;
})

const interactionLogicSchema = z.object({
    chainId: z.union([z.literal(8453), z.literal(84532)]),
    logicContract: z.string().min(1, { message: "Logic contract is required" }),
    logic: z.array(singleLogicRuleSchema),
}).transform((input, ctx) => {

    try {
        validateSetupActions([{
            logicContract: input.logicContract,
            creatorLogic: input.logic, // arbitrarily pass logic as creator logic
            minterLogic: []
        }])
    } catch (e) {
        console.log(e)
    }

    return input;

});

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

type SingleLogicRuleInput = z.input<typeof singleLogicRuleSchema>;
type SingleLogicRuleOutput = z.output<typeof singleLogicRuleSchema>;

export type InteractionLogicInput = z.input<typeof interactionLogicSchema>;
export type InteractionLogicOutput = z.output<typeof interactionLogicSchema>;
export type InteractionLogicState = InteractionLogicInput & { errors?: ZodSafeParseErrorFormat };

const DeadlineReducer = (state: InteractionLogicState, action: { type: string; payload: any }): InteractionLogicState => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: { ...state.errors, [action.payload.field]: undefined }, // Clear error when field is set
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload,
            };
        default:
            return state;
    }
}

export const useInteractionLogicSettings = (initialState?: InteractionLogicInput, required?: boolean) => {
    const [interactionLogic, dispatch] = useReducer(DeadlineReducer, {
        chainId: 8453,
        logic: [],
        logicContract: zeroAddress,
        ...initialState,
    });

    const setInteractionLogic = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }

    const validateInteractionLogic = async () => {
        const { errors, ...rest } = interactionLogic;
        const result = await interactionLogicSchema.safeParseAsync(rest);

        if (required && result.data.logic.length === 0) {
            dispatch({
                type: "SET_ERRORS",
                payload: { logic: { _errors: ["At least one rule is required"] } },
            });
            throw new Error("At least one rule is required");
        }

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof interactionLogicSchema>).error.format();
            console.log(formattedErrors);
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
            throw new Error("Failed to validate interaction logic");
        }

        return result;
    }
    return {
        interactionLogic,
        setInteractionLogic,
        validateInteractionLogic,
    };
}


const DisplayTokenRule = ({ mode, rule, chainId, onEdit, onRemove }: { mode: 'submit' | 'vote', rule: SingleLogicRuleInput, chainId: ChainId, onEdit: () => void, onRemove: () => void }) => {
    const { symbol, decimals, isLoading } = useTokenInfo(rule.target, chainId)
    return (
        <div className="flex flex-col gap-1 bg-base-100 border border-border rounded-lg p-2">
            <p className="text-t2 text-sm">Token: {symbol}</p>
            <p className="text-t2 text-sm">Threshold: {rule.literalOperand}</p>
            <p className="text-t2 text-sm">{mode === 'submit' ? 'Entries:' : 'Votes:'} {rule.interactionPower}</p>
            <div className="flex flex-row gap-2">
                <Button variant="outline" onClick={onEdit} ><HiPencil className="w-4 h-4" /></Button>
                <Button variant="outline" onClick={onRemove}>Remove</Button>
            </div>
        </div>
    )
}

const TokenInteractionLogic = ({
    mode,
    editIndex,
    interactionLogic,
    setInteractionLogic,
    isModalOpen,
    setIsModalOpen
}: {
    mode: "submit" | "vote",
    editIndex: number | undefined,
    interactionLogic: InteractionLogicInput,
    setInteractionLogic: (field: string, value: any) => void,
    isModalOpen: boolean,
    setIsModalOpen: (val: boolean) => void
}) => {

    const [progress, setProgress] = useState(editIndex === undefined ? 0 : 1);
    const [logicRule, setLogicRule] = useState<SingleLogicRuleInput>(
        editIndex !== undefined ? interactionLogic.logic[editIndex] : undefined
    )
    const [interactionPowerError, setInteractionPowerError] = useState<string | null>(null)
    const [literalOperandError, setLiteralOperandError] = useState<string | null>(null)
    const { symbol, decimals, isLoading } = useTokenInfo(logicRule?.target ?? "", interactionLogic.chainId)
    const { managedToken, setManagedToken, validateManagedToken } = useManagedTokenEditor({ chainId: interactionLogic.chainId });

    const handleCloseAndReset = () => {
        setIsModalOpen(false)
        setLiteralOperandError(null)
        setInteractionPowerError(null)
        setProgress(0)
    }

    const handleRuleSubmit = () => {
        if (!logicRule.literalOperand) {
            return setLiteralOperandError("Threshold is required")
        }

        if (!logicRule.interactionPower) {
            const modeSpecificText = mode === "submit" ? "entries" : "votes"
            return setInteractionPowerError(`Num. ${modeSpecificText} is required`)
        }

        const newLogic = [...interactionLogic.logic]

        if (newLogic.length === 0) {
            setInteractionLogic("logicContract", getDynamicLogicAddress(interactionLogic.chainId))
        }

        if (editIndex === undefined) {
            newLogic.push(logicRule)
        }
        else {
            newLogic[editIndex] = logicRule
        }

        setInteractionLogic('logic', newLogic)
        handleCloseAndReset()

    }


    const handleTokenConfirm = () => {
        try {
            const result = validateManagedToken();
            const { signature, data } = result.data.type === "ERC1155" ?
                { signature: "0x00fdd58e", data: encodeAbiParameters([{ type: "address", name: "address" }, { type: "uint256", name: "id" }], [zeroAddress, BigInt(result.data.tokenId)]) }
                : { signature: "0x70a08231", data: encodeAbiParameters([{ type: "address", name: "address" }], [zeroAddress]) }

            setLogicRule({
                chainId: interactionLogic.chainId,
                target: result.data.address,
                targetType: 'balanceOf',
                signature,
                operator: 'gt',
                interactionPowerType: 'uniform',
                literalOperand: '',
                interactionPower: '1',
                data
            })
            setProgress(1)
        } catch (e) {
            console.log(e)
        }

    }

    if (progress === 0) return (
        <>
            <AddToken
                state={managedToken}
                setManagedToken={setManagedToken}
            />
            <DialogFooter>
                <div className="flex w-full justify-between">
                    <Button variant="outline" onClick={handleCloseAndReset}>Cancel</Button>
                    <Button disabled={!managedToken.address} onClick={handleTokenConfirm}>Confirm</Button>
                </div>
            </DialogFooter >
        </>
    )


    if (progress === 1) return (
        /// eligibility criteria - hold less than, more than, exactly x tokens
        <>
            <DialogHeader>
                <DialogTitle>
                    {mode === 'submit' ? 'Submitter eligibility' : 'Voter eligibility'}
                </DialogTitle>
                <DialogDescription>
                    Set the eligibility criteria for {mode === 'submit' ? 'submitters' : 'voters'}. Users holding more than [threshold] tokens will be eligible to {mode === 'submit' ? 'submit' : 'vote'}.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col w-full p-2 gap-4">
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2">
                        <Label>
                            {symbol} Threshold
                        </Label>
                        <Input type="number" variant="outline" className="bg-transparent rounded-lg max-w-[200px]" onWheel={(e) => { e.currentTarget.blur() }} value={logicRule.literalOperand} onChange={(e) => {
                            setLiteralOperandError(null)
                            setLogicRule(prev => {
                                return {
                                    ...prev,
                                    literalOperand: asPositiveFloat(e.target.value, 2)
                                }
                            })
                        }} />
                        {literalOperandError && <FieldError error={literalOperandError} />}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>
                            {mode === 'submit' ? 'Entries' : 'Votes'}
                        </Label>
                        <Input type="number" variant="outline" className="bg-transparent rounded-lg max-w-[200px]" onWheel={(e) => { e.currentTarget.blur() }} value={logicRule.interactionPower} onChange={(e) => {
                            setInteractionPowerError(null)
                            setLogicRule(prev => {
                                return {
                                    ...prev,
                                    interactionPower: asPositiveInt(e.target.value)
                                }
                            })
                        }} />
                        {interactionPowerError && <FieldError error={interactionPowerError} />}
                    </div>
                </div>

                {logicRule.literalOperand && <div className="flex flex-row gap-2 items-center text-sm text-t2">
                    <p>Users holding more than</p>
                    <p className="font-bold">{logicRule.literalOperand}</p>
                    <p><b>{symbol}</b> receive {logicRule.interactionPower} {mode === 'submit' ? 'entries' : 'votes'}.</p>
                </div>
                }

                <DialogFooter>
                    <div className="flex w-full justify-between">
                        <Button variant="outline" onClick={handleCloseAndReset}>Cancel</Button>
                        <Button onClick={handleRuleSubmit}>Confirm</Button>
                    </div>
                </DialogFooter>

            </div>
        </>
    )
}



export const InteractionLogic = ({ interactionLogic, setInteractionLogic, mode }: { interactionLogic: InteractionLogicState, setInteractionLogic: (field: string, value: any) => void, mode: 'submit' | 'vote' }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editIndex, setEditIndex] = useState<number | undefined>();

    const handleEditRule = (indexToEdit: number) => {
        setEditIndex(indexToEdit)
        setIsModalOpen(true)
    }

    const handleRemoveRule = (indexToRemove: number) => {
        const newLogic = [...interactionLogic.logic]
        newLogic.splice(indexToRemove, 1)
        if (newLogic.length === 0) {
            setInteractionLogic("logicContract", zeroAddress)
        }
        setInteractionLogic("logic", newLogic)
    }


    return (
        <SectionWrapper title={`${mode === 'submit' ? 'Submitter' : 'Voter'} Rules`} >

            <Info>
                <div className="flex flex-row gap-6 items-center">
                    <IoMdInformationCircleOutline className="w-5 h-5 font-normal text-primary11" />

                    {mode === "submit" ?
                        `Who can submit, and how many entries can they submit? Leaving this empty means anyone can submit an unlimited number of times.`
                        :
                        `Who can vote, and how many votes can they cast?`
                    }
                </div>
            </Info>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="w-fit m-auto">+ Token balance rule</Button>
            <FieldError error={interactionLogic.errors?.logic?._errors?.join(",")} />
            <Dialog open={isModalOpen} onOpenChange={val => setIsModalOpen(val)}>
                <DialogContent>
                    <TokenInteractionLogic mode={mode} editIndex={editIndex} interactionLogic={interactionLogic} setInteractionLogic={setInteractionLogic} isModalOpen={isModalOpen} setIsModalOpen={() => { setIsModalOpen(false); setEditIndex(undefined) }} />
                </DialogContent>
            </Dialog>
            <div className="grid grid-cols-3 gap-2">
                {interactionLogic.logic.map((rule, index) => (
                    <DisplayTokenRule mode={mode} key={index} rule={rule} chainId={interactionLogic.chainId} onEdit={() => handleEditRule(index)} onRemove={() => handleRemoveRule(index)} />
                ))}
            </div>
        </SectionWrapper>
    )
}