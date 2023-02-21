import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import Sidebar from "../SideBar/SideBar";

export interface INav {}

const Nav: React.FC<INav> = () => {
  return (
    <div className="navbar bg-neutral">
      <div className="flex-1">
        <Image
          src={uplinkLogo}
          alt="uplink logo"
          width={20}
          height={20}
        />
      </div>
      <div>
        <button className="btn btn-primary">FAQ/About</button>
        <div className="p-2" />
        <WalletConnectButton />
        <Sidebar />
      </div>
    </div>
  );
};

export default Nav;
