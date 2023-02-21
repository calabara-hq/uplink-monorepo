import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";

export interface INav {}

const Nav: React.FC<INav> = () => {
  return (
    <div className="navbar justify-end bg-neutral">
      <div className="">
        <button className="btn btn-primary">FAQ/About</button>
        <div className="p-2" />
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Nav;
