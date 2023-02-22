import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";

export default function Sidebar() {
  return (
    <div className="flex flex-col bg-neutral x-0 y-0">
      <div className="py-6 pl-2 text-white text-center text-xl">
        <Image src={uplinkLogo} alt="uplink logo" width={100}/>
        <p>uplink</p>
      </div>
      <div className="flex flex-col h-full w-fit m-auto mt-4 text-3xl">
        <div
          className="flex items-center justify-center 
                        h-16 w-16 mt-2 mb-2 
                        bg-transparent hover:bg-primary
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
