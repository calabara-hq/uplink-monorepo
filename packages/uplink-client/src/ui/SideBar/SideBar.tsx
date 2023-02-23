import Image from "next/image";
import Link from "next/link";
import uplinkLogo from "../../../public/uplink-logo.svg";

export default function Sidebar() {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-0 w-16 h-screen pt-20 transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 text-white flex-col justify-center items-center">
          <li
            className="flex items-center justify-center 
                        h-10 w-10 mt-8 
                        bg-transparent hover:bg-[#303339]
                        text-white border-2 border-gray-200
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg
                        tooltip tooltip-info"
            data-tip="New Org"
          >
            <p>+</p>
          </li>
          <li
            className="avatar flex items-center justify-center 
                        h-10 w-10 
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
          </li>
          <li
            className="avatar flex items-center justify-center 
                        h-10 w-10 
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
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </aside>
  );

  /*
  return (
    <div className="w-1/10 h-screen sticky flex flex-col top-0 left-0 py-1 px-1 bg-blue-500">
      <div className="p-6 text-white text-center text-xl">
        <Link href={"/"}>
          <Image src={uplinkLogo} alt="uplink logo" />
          <p>uplink</p>
        </Link>
      </div>
      <div className="left-10 top-24 w-fit m-auto mt-4 text-3xl">

        <div
          className="flex items-center justify-center 
                        h-12 w-12 mt-2 mb-2 
                        bg-[#303339] hover:bg-primary
                        text-white border-1 border-gray-200
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg
                        tooltip tooltip-primary"
          data-tip="New Org"
        >
          <p>+</p>
        </div>
        <hr className="bg-gray-200 border border-gray-200 rounded-full mx-2" />
        <Link href={"/orgs"}>
          <div
            className="avatar flex items-center justify-center 
                        h-12 w-12 mt-2 mb-2  
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
        </Link>
        <hr className="bg-gray-200 border border-gray-200 rounded-full mx-2" />

        <Link href={"/orgs"}>
          <div
            className="avatar flex items-center justify-center 
                        h-12 w-12 mt-2 mb-2  
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
        </Link>
      </div>
    </div>
  );
  */
}
