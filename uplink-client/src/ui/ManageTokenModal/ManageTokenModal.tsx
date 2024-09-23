"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/DesignKit/Dialog"
import { Label } from "../DesignKit/Label"
import { Input } from "../DesignKit/Input"
import { ManagedTokenState } from "@/hooks/useTokenManager"
import { useState } from "react"
import { isAddress } from "viem";

export const AddToken = ({ state, setManagedToken }: { state: ManagedTokenState, setManagedToken: (field: string, value: any) => void }) => {

    //const [localAddress, setLocalAddress] = useState<string>("");

    const onChange = (value: string) => {
        // setLocalAddress(value);
        // if (isAddress(value)) {
        setManagedToken("address", value);
        //}
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Add Token
                </DialogTitle>
                {/* <DialogDescription>
                    Provide the details for the token you would like to add.
                </DialogDescription> */}
            </DialogHeader>
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label>
                        Token address
                    </Label>
                    <Input
                        variant={`${state?.errors?.address ? "error" : "outline"}`}
                        type="text"
                        placeholder={"0x1234..."}
                        value={state.address}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {state?.errors?.address && (
                        <Label className="text-error">{state.errors.address._errors.join(",")}</Label>
                    )}
                </div>

                {state.address && (

                    <div className="grid grid-cols-2 gap-2">
                        {state.type === "ERC1155" && (
                            <div className="flex flex-col gap-2">
                                <Label className="text-t2">
                                    Token ID
                                </Label>
                                <Input
                                    variant={state?.errors?.tokenId ? "error" : "outline"}
                                    type="number"
                                    value={state.tokenId}
                                    onChange={(e) => setManagedToken("tokenId", e.target.value)}
                                />
                                {state?.errors?.tokenId && (
                                    <Label className="text-error">{state.errors.tokenId._errors.join(",")}</Label>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <Label className="text-t2">
                                Symbol
                            </Label>
                            <Input
                                variant="outline"
                                type="text"
                                value={state.symbol}
                                disabled
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-t2">
                                Decimals
                            </Label>
                            <Input
                                variant={state?.errors?.decimals ? "error" : "outline"}
                                type="number"
                                value={state.decimals}
                                disabled={state.type !== "ERC1155"}
                                onChange={(e) => setManagedToken("decimals", parseInt(e.target.value))}
                            />
                            {state?.errors?.decimals && (
                                <Label className="text-error">{state.errors.decimals._errors.join(",")}</Label>
                            )}
                        </div>

                    </div>
                )}



            </div>
        </>
    )


}