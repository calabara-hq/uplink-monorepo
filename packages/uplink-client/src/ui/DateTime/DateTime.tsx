"use client";
import { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import "react-day-picker/dist/style.css";

export default function DateTimeSelector() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Date>();
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [meridiem, setMeridiem] = useState("AM");
  const [progress, setProgress] = useState<number>(0);
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
        handleCloseAndReset();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleCloseAndReset = () => {
    setIsModalOpen(false);
    setProgress(0);
  };

  const handleSubmitDay = () => {
    if (selected) {
      console.log(format(selected, "yyyy-MM-dd"));
      setProgress(1);
    }
  };

  const handleModalConfirm = () => {
    if (progress < 1 && selected) {
      setProgress(1);
    } else {
      console.log("date is", selected, "time is", hour, minute, meridiem);
      const date = new Date(selected);
      const adjustedHours =
        (parseInt(hour) % 12) + (meridiem === "PM" ? 12 : 0);
      date.setHours(adjustedHours, parseInt(minute));

      console.log(date.toISOString().slice(0, -5) + "Z");
      //handleCloseAndReset();
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
        Open Modal
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 w-fit">
          <div className="modal modal-open">
            <div ref={modalRef} className="modal-box">
              <h2 className="text-xl">Pick the day!</h2>
              <div className="w-full px-1 flex items-center justify-center">
                {progress === 0 && (
                  <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    disabled={disabledDays}
                    showOutsideDays
                  />
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
              <div className="modal-action">
                <button onClick={handleCloseAndReset} className="btn mr-auto">
                  Cancel
                </button>
                <button
                  disabled={progress < 1 ? !selected : !hour && !minute}
                  onClick={handleModalConfirm}
                  className="btn"
                >
                  {progress < 1 ? "Next" : "Submit"}
                </button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-50"></div>
        </div>
      )}
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
    <div className="flex items-center ">
      <input
        type="text"
        value={hour}
        onChange={handleHourChange}
        placeholder="hh"
        className="input input-bordered w-24 border"
      />
      <span className="px-2">:</span>
      <input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        placeholder="mm"
        className="input input-bordered w-24 border"
        ref={minuteInputRef}
      />
      <div className="ml-4 ">
        <button
          onClick={() => {
            setMeridiem("AM");
          }}
          className={`btn-sm border-transparent border-2 text-white rounded-l-full fadeColor ${
            meridiem === "AM" ? "bg-blue-400" : "bg-grey-700"
          }`}
        >
          AM
        </button>
        <button
          onClick={() => {
            setMeridiem("PM");
          }}
          className={`btn-sm border-transparent border-2 text-white rounded-r-full fadeColor ${
            meridiem === "PM" ? "bg-blue-400" : "bg-grey-700"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
};
