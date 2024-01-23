import Link from "next/link";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import uplinkLogo from "../../../public/uplink-logo.svg";
import UplinkImage from "@/lib/UplinkImage"
const MobileNav = () => {
  return (
    <>
      <Link href="/" draggable={false}>
        <UplinkImage src={uplinkLogo} alt="uplink logo" height={20} width={20} />
        <span className="btm-nav-label">Home</span>
      </Link>

      <Link href="/explore" draggable={false}>
        <HiOutlineRectangleGroup className="h-8 w-8" />
        <span className="btm-nav-label">Explore</span>
      </Link>
      <div>
        <WalletConnectButton />
      </div>
    </>
  );
};

export default MobileNav;
