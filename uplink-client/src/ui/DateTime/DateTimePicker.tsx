"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { toZonedTime } from 'date-fns-tz';
import { isBefore, startOfDay } from "date-fns";

import { cn } from "@/lib/shadcn"
import { Button } from "@/ui/DesignKit/Button"
import { Calendar } from "@/ui/DesignKit/Calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/ui/DesignKit/Popover"
import { TimePicker } from "./TimePicker"
import { LuClock } from "react-icons/lu";

// Function to format the Unix timestamp
const formatDateTimeToClientTimezone = (timestampInSeconds: number) => {
    // Convert Unix timestamp (seconds) to milliseconds
    const date = new Date(timestampInSeconds * 1000);

    // Get client's timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert the date to the client's timezone
    const zonedDate = toZonedTime(date, timeZone);

    // Format the date to "Month Day, Time"
    const formattedDate = format(zonedDate, 'MMMM dd, hh:mm a');

    return formattedDate;
}

export function DateTimePicker({ includeTimePicker, timestampInSeconds, onSelect }: { includeTimePicker?: boolean, timestampInSeconds: number | undefined, onSelect: (timestamp: number) => void }) {

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Convert the selected date to Unix timestamp in seconds
            const unixTimestamp = Math.floor(selectedDate.getTime() / 1000);
            onSelect(unixTimestamp);
        }
    }

    // Function to determine if a date should be disabled (true for dates before today)
    const disablePastDates = (date: Date) => {
        const today = startOfDay(new Date()); // Get the start of today
        return isBefore(date, today); // Disable if the date is before today
    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !timestampInSeconds && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {timestampInSeconds ? formatDateTimeToClientTimezone(timestampInSeconds) : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-base-200 border border-border" align="start">
                <Calendar
                    mode="single"
                    selected={timestampInSeconds ? new Date(timestampInSeconds * 1000) : undefined}
                    onSelect={handleDateSelect}
                    disabled={disablePastDates}
                />
                <div className="w-full h-0.5 bg-base-300" />
                <div className="p-1 w-full h-0.5" />
                <div className="flex gap-4 items-center w-fit m-auto">
                    <LuClock className="h-6 w-6 text-t3" />
                    {includeTimePicker && <TimePicker setDate={handleDateSelect} date={timestampInSeconds ? new Date(timestampInSeconds * 1000) : undefined} />}
                </div>
                <div className="p-1 w-full h-0.5" />

            </PopoverContent>
        </Popover>
    )
}
