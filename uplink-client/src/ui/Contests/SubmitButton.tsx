"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const SubmitButton = ({ callback }: { callback?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    callback ? callback() : router.push(pathname + "/studio");
  };

  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
      <button onClick={handleClick} className="btn btn-primary flex flex-1">
        Submit
      </button>
      <p className="mx-2 p-2 text-center">4 days</p>
    </div>
  );
};

export default SubmitButton;
