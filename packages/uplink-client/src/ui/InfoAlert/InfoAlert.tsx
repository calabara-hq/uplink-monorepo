import Image from "next/image";
import {SparklesIcon} from "@heroicons/react/24/solid";

const InfoAlert = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="alert bg-neutral border-2 border-[#3ABFF8] p-2 w-fit shadow-lg">
      <div className="flex flex-row gap-2 text-xs sm:text-sm md:text-md lg:text-base w-full p-0">
        <SparklesIcon className="w-6 h-6" />
        {children}
      </div>
    </div>
  );
};

export default InfoAlert;


