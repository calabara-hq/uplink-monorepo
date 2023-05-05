import Image from "next/image";
import {SparklesIcon} from "@heroicons/react/24/solid";

const InfoAlert = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="alert bg-transparent border-2 border-info p-2 w-fit shadow-lg">
      <div className="flex flex-row gap-2 text-xs sm:text-sm md:text-md lg:text-base w-full p-0">
        <SparklesIcon className="w-5 h-5" />
        {children}
      </div>
    </div>
  );
};

export default InfoAlert;


