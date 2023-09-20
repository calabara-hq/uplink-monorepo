import Image from "next/image";
import Link from "next/link";
import { HiMagnifyingGlass } from "react-icons/hi2";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import uplinkLogo from "../../../public/uplink-logo.svg";

const MobileNav = () => {
  return (
    <>
      <Link href="/">
        <Image src={uplinkLogo} alt="uplink logo" height={24} width={24} />
        <span className="btm-nav-label">Home</span>
      </Link>

      <Link href="/spaces">
        <HiMagnifyingGlass className="h-8 w-8" />
        <span className="btm-nav-label">spaces</span>
      </Link>
      <div>
        <WalletConnectButton />
      </div>
    </>
  );
};

export default MobileNav;
