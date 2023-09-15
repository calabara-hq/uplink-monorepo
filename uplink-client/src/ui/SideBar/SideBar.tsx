import Image from "next/image";
import Link from "next/link";
import {
  HiHome,
  HiMagnifyingGlass,
  HiOutlineRectangleGroup,
  HiPlus,
} from "react-icons/hi2";
import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton2 from "../ConnectButton/ConnectButton2";

export default function Sidebar() {
  return (
    <div className="h-full w-full bg-base-100 shadow-xl hidden md:flex md:flex-col py-2">
      <SideBarIcon
        icon={
          <Image src={uplinkLogo} alt="uplink logo" height={28} width={28} />
        }
        text="Home"
        path={"/"}
      />
      <div className="py-1"></div>
      <Divider />
      <SideBarIcon
        icon={<HiOutlineRectangleGroup className="h-6 w-6" />}
        text="Spaces"
        path={"/spaces"}
      />
      <SideBarIcon
        icon={<HiPlus className="h-6 w-6" />}
        text="Create a space"
        path={"/spacebuilder/create"}
      />
    </div>
  );
}

const SideBarIcon = ({
  icon,
  text,
  path,
}: {
  icon: any;
  text: string;
  path: string;
}) => (
  <Link
    href={path}
    className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto
  hover:bg-accent bg-gray-800 text-accent hover:text-black 
  hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
  >
    {icon}
    <span
      className="absolute flex items-center justify-center z-10 bg-black w-auto p-2 m-2 min-w-max left-14 normal-case
    text-t1 text-sm font-bold
    rounded-md shadow-md transition-all duration-300 scale-0 origin-left group-hover:scale-100"
    >
      <p>{text}</p>
    </span>
  </Link>
);

const Divider = () => (
  <hr className="bg-gray-200 border border-gray-600 mx-2" />
);
