import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";

export interface INav {}

const Nav: React.FC<INav> = () => {
  return (
    <div className="flex justify-center bg-black w-full">
      <button className="btn">hello from daisy ui</button>
      <WalletConnectButton />
    </div>
  );
};

export default Nav;
