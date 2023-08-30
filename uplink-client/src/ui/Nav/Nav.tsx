import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import WalletConnectButton2 from "../ConnectButton/ConnectButton2";

const Nav = () => {
  return (
    <nav className="h-20 w-full bg-base-100 hidden md:flex">
      <div className="flex px-3 py-3 w-11/12 ml-auto mr-auto">
        <div className="flex items-center justify-center mr-auto gap-2">
          <Image
            src={uplinkLogo}
            alt="uplink logo"
            height={28}
            width={28}
            className="flex md:hidden"
          />
          <h1 className="text-lg text-white font-bold">Uplink</h1>
          <div className="badge badge-xs bg-gray-700 border-0 p-2 text-gray-400">
            1.0.1
          </div>
        </div>
        <div className="flex items-center justify-center ml-auto">
          <WalletConnectButton2 />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
