import Image from "next/image";
import Link from "next/link";
import uplinkLogo from "../../../public/uplink-logo.svg";

export default function Sidebar() {
  return (
    <div className="flex flex-col relative h-full x-0 y-0">
      <div className="p-6 text-white text-center text-xl">
        <Link href={"/"}>
          <Image src={uplinkLogo} alt="uplink logo" width={100} />
          <p>uplink</p>
        </Link>
      </div>
      <div className="fixed left-10 top-24 w-fit m-auto mt-4 text-3xl">
        <div
          className="flex items-center justify-center 
                        h-16 w-16 mt-2 mb-2 
                        bg-transparent hover:bg-[#303339]
                        text-white border-2 border-gray-200
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg
                        tooltip tooltip-info"
          data-tip="New Org"
        >
          <p>+</p>
        </div>
        <hr className="bg-gray-200 border border-gray-200 rounded-full mx-2" />
        <div
          className="avatar flex items-center justify-center 
                        h-16 w-16 mt-2 mb-2  
                    bg-gray-400 
                    text-green-500
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg"
        >
          <Image
            src={"/noun-47.png"}
            alt={"org avatar"}
            height={50}
            width={50}
          />
        </div>
        <hr className="bg-gray-200 border border-gray-200 rounded-full mx-2" />

        <div
          className="avatar flex items-center justify-center 
                        h-16 w-16 mt-2 mb-2  
                    bg-gray-400 
                    text-green-500
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg"
        >
          <Image
            src={"/noun-47.png"}
            alt={"org avatar"}
            height={50}
            width={50}
          />
        </div>
      </div>
    </div>
  );
}
