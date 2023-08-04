import Image from "next/image";
import { HiSparkles } from "react-icons/hi2";

const InfoAlert = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="alert bg-transparent p-1 pl-0 w-fit text-accent-content">
      <div className="flex flex-row gap-2 text-sm md:text-md lg:text-base w-full p-0">
        <HiSparkles className="lg:w-5 lg:h-5 w-3 h-3" />
        {children}
      </div>
    </div>
  );
};

export default InfoAlert;
