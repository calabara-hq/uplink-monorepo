import Image from "next/image";
import Link from "next/link";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import uplinkLogo from "../../../public/uplink-logo.svg";
import Logo from "../Logo/Logo";

export default function Sidebar() {
  return (
    <>
      {/* large screen menu bar */}
      <div className="h-screen w-16 bg-base-100 shadow-lg hidden md:flex md:flex-col py-2">
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
          icon={<PlusIcon className="h-6 w-6" />}
          text="Create a space"
          path={"/spacebuilder/create"}
        />
        <SideBarIcon
          icon={<MagnifyingGlassIcon className="h-6 w-6" />}
          text="Explore"
          path={"/explore"}
        />
      </div>

      {/* small screen menu bar */}
      <div className="fixed bottom-0 h-16 z-20 w-full bg-base-100 md:hidden">
        <div className="bg-border h-[1px] w-full"></div>
        <MobileMenu />
      </div>
    </>
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
  <div
    className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto
  hover:bg-accent bg-gray-800 text-accent hover:text-black 
  hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
  >
    <Link href={path}>{icon}</Link>
    <span
      className="absolute w-auto p-2 m-2 min-w-max left-14 
    text-white bg-gray-600 text-xs font-bold
    rounded-md shadow-md transition-all duration-300 scale-0 origin-left group-hover:scale-100"
    >
      {text}
    </span>
  </div>
);

const Divider = () => (
  <hr className="bg-gray-200 border border-gray-600 mx-2" />
);

const MobileCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-1/3 btn btn-ghost rounded-full">
      {children}
    </div>
  );
};

const MobileMenu = () => {
  return (
    <div className="flex flex-row w-full justify-between p-2">
      <MobileCard>
        <HomeIcon className="h-8 w-8" />
        <p>home</p>
      </MobileCard>
      <div className="bg-border w-[1px]"></div>
      <MobileCard>
        <MagnifyingGlassIcon className="h-8 w-8" />
        <p>explore</p>
      </MobileCard>
      <div className="bg-border w-[1px]"></div>
      <MobileCard>
        <p>my spaces</p>
      </MobileCard>
    </div>
  );
};
