import Link from "next/link";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { IoFlameOutline } from "react-icons/io5";
import uplinkLogo from "../../../public/uplink-logo.svg";
import UplinkImage from "@/lib/UplinkImage"
const MobileNav = () => {
  return (
    <div className="btm-nav  z-20 sm:hidden  border-t-base-100 border-t-[1px] bg-base">

      <div className="pl-2 pr-2 m-auto grid grid-cols-[25%_75%] items-center bg-base">
        <Link href="/explore" draggable={false} className=" w-full m-auto flex flex-col items-center">
          <IoFlameOutline className="h-7 w-7" />
        </Link>
        <div className="w-full ml-auto ">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
