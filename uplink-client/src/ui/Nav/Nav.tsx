import Image from "next/image";
import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";

const fetchVersion = async () => {
  if (process.env.NEXT_PUBLIC_CLIENT_URL === "http://localhost:3000")
    return "dev";
  const res = await fetch(
    "https://api.github.com/repos/calabara-hq/uplink-monorepo/tags",
    { next: { revalidate: 1440 } }
  ).then((res) => res.json());
  const tag = res[0].name.split("v")[1];

  return tag;
};

const Nav = async () => {
  const version = await fetchVersion();
  return (
    <nav className="h-20 w-full bg-base-100 hidden md:flex">
      <div className="flex px-3 py-3 w-11/12 ml-auto mr-auto">
        <div className="flex items-center justify-center mr-auto gap-2">
          <Image
            src={uplinkLogo}
            alt="uplink logo"
            height={28}
            width={28}
            className="flex md:hidden"
          />
          <div className="flex gap-2 items-center justify-center">
            <p className="text-lg text-white font-bold">Uplink</p>
            <p className={`badge border-none badge-sm bg-base-200 text-t2`}>
              {version}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center ml-auto">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
