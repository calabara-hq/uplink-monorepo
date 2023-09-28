import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
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
          <div className="flex gap-2 items-center justify-center">
            <p className="text-2xl text-white font-bold">Uplink</p>
            <p
              className={`badge border-none badge-md bg-base-200 text-t2 font-semibold`}
            >
              1.0.1
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center ml-auto">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
