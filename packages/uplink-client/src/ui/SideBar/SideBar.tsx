import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";

export default function Sidebar() {
  return (
    <div className="flex flex-col bg-neutral x-0 y-0">
      <div className="py-6 pl-4">
        <Image src={uplinkLogo} alt="uplink logo" width={150}/>
      </div>
      <div className="flex flex-col h-full w-fit m-auto text-3xl">
        <div
          className="flex items-center justify-center 
                        h-16 w-16 mt-2 mb-2 
                        bg-gray-600 hover:bg-primary 
                        text-white
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg
                        tooltip"
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
      </div>
    </div>
  );
}
