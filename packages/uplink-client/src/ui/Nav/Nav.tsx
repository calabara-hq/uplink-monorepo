import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
import Logo from "../Logo/Logo";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import Link from "next/link";
export interface INav {}

const Nav: React.FC<INav> = () => {
  return (
    <nav className="top-0 z-50 w-11/12 ml-auto mr-auto">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <Link href="/" className="flex ml-0 md:mr-24 w-28">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-20">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
