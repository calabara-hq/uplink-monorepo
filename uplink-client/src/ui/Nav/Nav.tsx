import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
//import Logo from "../Logo/Logo";

import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import Link from "next/link";
export interface INav {}

const Nav: React.FC<INav> = () => {
  return (
    <nav className="h-20 w-full bg-base-100 flex">
      <div className="flex px-3 py-3 w-11/12 ml-auto mr-auto">
        <div className="flex items-center justify-center mr-auto gap-2">
          <Image src={uplinkLogo} alt="uplink logo" height={28} width={28} className="flex md:hidden"/>
          <h1 className="text-lg text-white font-bold" >Uplink</h1>
          <div className="badge badge-xs bg-gray-700 border-0 p-2 text-gray-400">1.0.1</div>
        </div>
        <div className="flex items-center justify-center ml-auto">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
