import { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import "react-day-picker/dist/style.css";
import { ISODateString } from "@/providers/SessionProvider";
import Modal, { ModalActions } from "../Modal/Modal";

const deconstructIsoString = (isoString: ISODateString | "now") => {
  const date = isoString === "now" ? new Date(Date.now()) : new Date(isoString);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const meridiem = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const adjustedMinute = minute < 10 ? "0" + minute : minute;
  return {
    iDate: date,
    iHour: adjustedHour.toString(),
    iMinute: adjustedMinute.toString(),
    iMeridiem: meridiem,
  };
};

// .rdp-day_selected, .rdp-day_selected:hover, .rdp-day_selected:focus {
//   background-color: #5d9cec;
//   color: black;
// }
// .rdp-day_selected:hover:not([disabled]) {
//   background-color: #5d9cec;
// }

const css = `


  .my-selected:not([disabled]) { 
    font-weight: bold;
    color: black;
    background-color: #5d9cec;
  }
  .my-selected:hover:not([disabled]) { 
    background-color: #1c1f26;
  }
  .my-today { 
    text-decoration: underline;
    font-size: 120%;
    }
  .rdp-day:not([disabled]):hover:not(.my-selected):hover{
    background-color: #2b303b;
  }
`;

const constructIsoString = (
  date: Date,
  hour: string,
  minute: string,
  meridiem: string
) => {
  const dateObj = new Date(date);
  const adjustedHours = (parseInt(hour) % 12) + (meridiem === "PM" ? 12 : 0);
  dateObj.setHours(adjustedHours, parseInt(minute));
  return dateObj.toISOString();
};

export default function DateTimeSelector({
  isoString,
  label,
  error,
  callback,
}: {
  isoString: string;
  label: string;
  callback: (isoString: string) => void;
  error?: string;
}) {
  const { iDate, iHour, iMinute, iMeridiem } = deconstructIsoString(isoString);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date>(iDate);
  const [hour, setHour] = useState(iHour);
  const [minute, setMinute] = useState(iMinute);
  const [meridiem, setMeridiem] = useState(iMeridiem);
  const [progress, setProgress] = useState<number>(0);

  const createReadableDate = () => {
    if (isoString === "now") {
      return "now";
    }
    return format(new Date(isoString), "MMM d, yyyy h:mm aa");
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const minDate = new Date();
  // max date should be a year from now
  const maxDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );

  const disabledDays = {
    before: minDate,
    after: maxDate,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleHardReset();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleHardReset = () => {
    setIsModalOpen(false);
    setSelectedDay(iDate);
    setHour(iHour);
    setMinute(iMinute);
    setMeridiem(iMeridiem);
    setProgress(0);
  };

  const handleModalConfirm = () => {
    if (progress < 1 && selectedDay) {
      setProgress(1);
    } else {
      const isoString = constructIsoString(selectedDay, hour, minute, meridiem);
      callback(isoString);
      setIsModalOpen(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">{label} date</span>
        </label>

        <input
          type="text"
          readOnly
          value={createReadableDate()}
          className={`input w-full max-w-xs disabled:text-gray-300 cursor-pointer ${
            error ? "input-error" : "input"
          }`}
          onClick={() => setIsModalOpen(true)}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
      <Modal isModalOpen={isModalOpen} onClose={handleHardReset}>
        <>
          <div className="w-full px-1 flex flex-col gap-2 items-center justify-center">
            <h2 className="text-xl">
              {progress < 1 ? `select ${label} date` : `select ${label} time`}
            </h2>
            {progress === 0 && (
              <>
                <style>{css}</style>
                <DayPicker
                  mode="single"
                  required
                  selected={selectedDay}
                  onSelect={(day) => setSelectedDay(day as Date)}
                  disabled={disabledDays}
                  showOutsideDays
                  modifiersClassNames={{
                    selected: "my-selected",
                    today: "my-today",
                  }}
                />
              </>
            )}
            {progress === 1 && (
              <TimeSelector
                hour={hour}
                minute={minute}
                meridiem={meridiem}
                setHour={setHour}
                setMinute={setMinute}
                setMeridiem={setMeridiem}
              />
            )}
          </div>
          <ModalActions
            onCancel={handleHardReset}
            onConfirm={handleModalConfirm}
            confirmDisabled={minute === "" || hour === ""}
            confirmLabel={progress < 1 ? "Next" : "Confirm"}
            cancelLabel="Cancel"
          />
        </>
      </Modal>
    </div>
  );
}

const TimeSelector = ({
  hour,
  minute,
  meridiem,
  setHour,
  setMinute,
  setMeridiem,
}: {
  hour: string;
  minute: string;
  meridiem: string;
  setHour: (value: string) => void;
  setMinute: (value: string) => void;
  setMeridiem: (value: string) => void;
}) => {
  const minuteInputRef = useRef<HTMLInputElement>(null);

  const handleHourChange = (e: any) => {
    const value = e.target.value;
    if (value === "" || (value.length <= 2 && /^([1-9]|1[0-2])$/.test(value))) {
      setHour(value);
      if (value.length === 2 || value === "2") {
        minuteInputRef.current?.focus();
      }
    }
  };

  const handleMinuteChange = (e: any) => {
    const value = e.target.value;
    if (value === "" || (value.length <= 2 && /^([0-5]?[0-9])$/.test(value))) {
      setMinute(value);
      if (value.length === 2) {
        minuteInputRef.current?.blur();
      }
    }
  };

  return (
    <div className="flex items-center m-4">
      <input
        type="text"
        value={hour}
        onChange={handleHourChange}
        placeholder="hh"
        className="input w-24 border bg-base-200 text-white"
      />
      <span className="px-2">:</span>
      <input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        placeholder="mm"
        className="input w-24 border bg-base-200 text-white"
        ref={minuteInputRef}
      />
      <div className="ml-4 ">
        <button
          onClick={() => {
            setMeridiem("AM");
          }}
          className={`btn-sm border-transparent border-2 rounded-l-full fadeColor ${
            meridiem === "AM"
              ? "bg-primary text-black"
              : "bg-base-100 text-white"
          }`}
        >
          AM
        </button>
        <button
          onClick={() => {
            setMeridiem("PM");
          }}
          className={`btn-sm border-transparent border-2 rounded-r-full fadeColor ${
            meridiem === "PM"
              ? "bg-primary text-black"
              : "bg-base-100 text-white"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
};
