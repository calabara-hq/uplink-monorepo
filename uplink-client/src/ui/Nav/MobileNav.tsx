import Link from "next/link";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import uplinkLogo from "../../../public/uplink-logo.svg";
import UplinkImage from "@/lib/UplinkImage"
const MobileNav = () => {
  return (
    <div className="btm-nav z-20 sm:hidden shadow-[0_35px_60px_15px_black] bg-base">

      {/* <Link href="/" draggable={false}>
        <UplinkImage src={uplinkLogo} alt="uplink logo" height={20} width={20} />
        <span className="btm-nav-label">Home</span>
      </Link> */}

      {/* <Link href="/explore" draggable={false}>
        <HiOutlineRectangleGroup className="h-8 w-8" />
        <span className="btm-nav-label">Explore</span>
      </Link> */}

      <div className="pl-2 pr-2 m-auto grid grid-cols-[25%_75%] items-center ">
        <Link href="/explore" draggable={false} className=" w-full m-auto flex flex-col items-center">
          <HiOutlineRectangleGroup className="h-8 w-8" />
          <span className="btm-nav-label">Explore</span>
        </Link>
        <div className="w-full ml-auto">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
