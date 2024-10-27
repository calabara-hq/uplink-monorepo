import UplinkImage from "@/lib/UplinkImage"
import Image from "next/image";
import Link from "next/link";

import uplinkLogo from "../../../public/uplink-logo.svg";
import { IoFlameOutline } from "react-icons/io5";
import { NewButton } from "./SidebarClient";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="h-full w-full shadow-xl hidden sm:flex sm:flex-col py-2">
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
        icon={<IoFlameOutline className="h-6 w-6" />}
        text="Explore"
        path={"/explore"}
      />
      {/* <SideBarIcon
        icon={<HiPlus className="h-6 w-6" />}
        text="New"
        path={"/spacebuilder/create"}
      /> */}
      <NewButton />
      <div className="mt-auto" />
      {/* <SideBarIcon
        icon={<FaTwitter className="h-5 w-5" />}
        text="Twitter"
        path={"https://twitter.com/uplinkwtf"}
        external
      />
      <SideBarIcon
        icon={
          <svg width="20" height="20" viewBox="0 0 1000 1000" fill="#b0436e" xmlns="http://www.w3.org/2000/svg">
            <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" fill="#b0436e" />
            <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill="#b0436e" />
            <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" fill="#b0436e" />
          </svg>
        }
        text="Warpcast"
        path={"https://warpcast.com/~/channel/uplink"}
        external
      />
      <SideBarIcon
        icon={<FaDiscord className="h-5 w-5" />}
        text="Discord"
        path={"https://discord.gg/yG5w2YT4BD"}
        external
      />
      <SideBarIcon
        icon={<FaGithub className="h-5 w-5" />}
        text="Github"
        path={"https://github.com/calabara-hq/uplink-monorepo"}
        external
      /> */}
      <a className="ml-3" target="_blank" href="https://nouns.wtf">
        <div className="w-8 h-8">
          <svg
            width="40"
            height="30"
            viewBox="0 0 160 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="crispEdges"
          >
            <path d="M90 0H30V10H90V0Z" fill={"#b0436e"} />
            <path d="M160 0H100V10H160V0Z" fill={"#b0436e"} />
            <path d="M40 10H30V20H40V10Z" fill={"#b0436e"} />
            <path d="M60 10H40V20H60V10Z" fill="white" />
            <path d="M80 10H60V20H80V10Z" fill="black" />
            <path d="M90 10H80V20H90V10Z" fill={"#b0436e"} />
            <path d="M110 10H100V20H110V10Z" fill={"#b0436e"} />
            <path d="M130 10H110V20H130V10Z" fill="white" />
            <path d="M150 10H130V20H150V10Z" fill="black" />
            <path d="M160 10H150V20H160V10Z" fill={"#b0436e"} />
            <path d="M40 20H0V30H40V20Z" fill={"#b0436e"} />
            <path d="M60 20H40V30H60V20Z" fill="white" />
            <path d="M80 20H60V30H80V20Z" fill="black" />
            <path d="M110 20H80V30H110V20Z" fill={"#b0436e"} />
            <path d="M130 20H110V30H130V20Z" fill="white" />
            <path d="M150 20H130V30H150V20Z" fill="black" />
            <path d="M160 20H150V30H160V20Z" fill={"#b0436e"} />
            <path d="M10 30H0V40H10V30Z" fill={"#b0436e"} />
            <path d="M40 30H30V40H40V30Z" fill={"#b0436e"} />
            <path d="M60 30H40V40H60V30Z" fill="white" />
            <path d="M80 30H60V40H80V30Z" fill="black" />
            <path d="M90 30H80V40H90V30Z" fill={"#b0436e"} />
            <path d="M110 30H100V40H110V30Z" fill={"#b0436e"} />
            <path d="M130 30H110V40H130V30Z" fill="white" />
            <path d="M150 30H130V40H150V30Z" fill="black" />
            <path d="M160 30H150V40H160V30Z" fill={"#b0436e"} />
            <path d="M10 40H0V50H10V40Z" fill={"#b0436e"} />
            <path d="M40 40H30V50H40V40Z" fill={"#b0436e"} />
            <path d="M60 40H40V50H60V40Z" fill="white" />
            <path d="M80 40H60V50H80V40Z" fill="black" />
            <path d="M90 40H80V50H90V40Z" fill={"#b0436e"} />
            <path d="M110 40H100V50H110V40Z" fill={"#b0436e"} />
            <path d="M130 40H110V50H130V40Z" fill="white" />
            <path d="M150 40H130V50H150V40Z" fill="black" />
            <path d="M160 40H150V50H160V40Z" fill={"#b0436e"} />
            <path d="M90 50H30V60H90V50Z" fill={"#b0436e"} />
            <path d="M160 50H100V60H160V50Z" fill={"#b0436e"} />
          </svg>
        </div>
      </a>
    </div>
  );
}

const SideBarIcon = ({
  icon,
  text,
  path,
  external = false,
}: {
  icon: any;
  text: string;
  path: string;
  external?: boolean;
}) => (
  <Link
    href={path}
    draggable={false}
    target={external ? "_blank" : "_self"}
    className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto
  hover:bg-base-300 bg-base-100 text-primary 
  hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
  >
    {icon}
    <span
      className="absolute flex items-center justify-center z-10 bg-base-300 border border-border w-auto p-2 m-2 min-w-max left-14 normal-case
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
