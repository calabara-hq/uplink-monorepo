import Image from "next/image";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";

export interface INav { }

const Nav: React.FC<INav> = () => {
  return (
    <div className="navbar bg-neutral">
      <div className="flex-1">
        <Image
          src={"/uplink-logo.svg"}
          alt={"uplink logo"}
          height={150}
          width={200}
        />
      </div>
      <div>
        <button className="btn btn-primary">FAQ/About</button>
        <div className="p-2" />
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Nav;
