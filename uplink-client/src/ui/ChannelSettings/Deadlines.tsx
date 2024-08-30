"use client";

import { useReducer, useState } from "react";
import { z } from "zod";
import { FieldError, SectionWrapper } from "./Utils";
import { Label } from "../DesignKit/Label";
import { DateTimePicker } from "../DateTime/DateTimePicker";
import { validateFiniteTransportLayer } from "@tx-kit/sdk/utils";
import { NATIVE_TOKEN } from "@tx-kit/sdk";


const deadlineSchema = z.object({
    createStart: z.number().min(1, { message: "Submit date is required" }),
    mintStart: z.number().min(1, { message: "Vote date is required" }),
    mintEnd: z.number().min(1, { message: "Contest end date is required" }),
}).transform((data, ctx) => {

    try {
        validateFiniteTransportLayer({
            createStartInSeconds: data.createStart,
            mintStartInSeconds: data.mintStart,
            mintEndInSeconds: data.mintEnd,
            rewards: { // don't care about rewards here. use random values
                ranks: [],
                allocations: [],
                totalAllocation: BigInt(0),
                token: NATIVE_TOKEN
            }
        });

        return data;

    } catch (e) {
        console.log(e)

        if (e.message.includes("Invalid mint start time")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['mintStart'],
                message: "Invalid vote start time. Mint start time must be after submit start time",
            });
        }

        if (e.message.includes("Invalid mint end time")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['mintEnd'],
                message: "Invalid contest end time. Contest end time must be after vote start time",
            });
        }


        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: e.message,
        });
    }
});

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export type DeadlineInput = z.input<typeof deadlineSchema>;
export type DeadlineOutput = z.output<typeof deadlineSchema>;
export type DeadlineState = DeadlineInput & { errors?: ZodSafeParseErrorFormat };

const DeadlineReducer = (state: DeadlineState, action: { type: string; payload: any }): DeadlineState => {
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

export const useDeadlineSettings = (initialState?: DeadlineInput) => {
    const [deadlines, dispatch] = useReducer(DeadlineReducer, {
        createStart: undefined,
        mintStart: undefined,
        mintEnd: undefined,
        ...initialState,
    });

    const setDeadlines = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }

    const validateDeadlines = () => {
        const { errors, ...rest } = deadlines;
        const result = deadlineSchema.safeParse(rest);

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof deadlineSchema>).error.format();
            console.log(formattedErrors);
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
            throw new Error("Invalid deadline settings");
        }

        return result;
    }
    return {
        deadlines,
        setDeadlines,
        validateDeadlines,
    };
}

export const Deadlines = ({ deadlines, setDeadlines }: { deadlines: DeadlineState, setDeadlines: (field: string, value: any) => void }) => {

    return (
        <SectionWrapper title="Deadlines">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex flex-col gap-2">
                    <Label>
                        Submit start
                    </Label>
                    <DateTimePicker includeTimePicker={true} timestampInSeconds={deadlines.createStart} onSelect={(val) => setDeadlines('createStart', val)} />
                    {deadlines.errors?.createStart?._errors && (
                        <FieldError error={deadlines.errors.createStart._errors.join(",")} />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label>
                        Vote start
                    </Label>
                    <DateTimePicker includeTimePicker={true} timestampInSeconds={deadlines.mintStart} onSelect={(val) => setDeadlines('mintStart', val)} />
                    {deadlines.errors?.mintStart?._errors && (
                        <FieldError error={deadlines.errors.mintStart._errors.join(",")} />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Contest end
                    </Label>
                    <DateTimePicker includeTimePicker={true} timestampInSeconds={deadlines.mintEnd} onSelect={(val) => setDeadlines('mintEnd', val)} />
                    {deadlines.errors?.mintEnd?._errors && (
                        <FieldError error={deadlines.errors.mintEnd._errors.join(",")} />
                    )}
                </div>
            </div>
        </SectionWrapper>

    )
}