import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import Image from "next/image";


const Nav = async () => {
  return (
    <nav className="h-20 w-full hidden sm:flex">
      <div className="flex w-10/12 ml-auto mr-auto items-center">
        <div className="flex items-center justify-center mr-auto gap-2">
          <Image
            src={uplinkLogo}
            alt="uplink logo"
            height={28}
            width={28}
            className="flex sm:hidden"
          />
          <div className="flex gap-2 items-center justify-center">
            <p className="text-lg text-white font-bold">Uplink</p>
          </div>
        </div>
        <div className="flex items-center justify-center ml-auto gap-2">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
