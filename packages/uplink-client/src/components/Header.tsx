import WalletConnectButton from "./ConnectButton";

export default function Header() {
  return (
    <div className="flex justify-center bg-black w-full">
      <button className="btn">hello from daisy ui</button>
      <WalletConnectButton />
    </div>
  );
}
