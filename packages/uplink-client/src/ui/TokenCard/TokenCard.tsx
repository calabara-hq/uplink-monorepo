import { IToken, INativeToken, IERCToken } from "@/types/token";
import TokenBadge from "../TokenBadge/TokenBadge";
import Image from "next/image";
import EthLogo from "../../../public/eth-logo.png";
import { TrashIcon } from "@heroicons/react/24/solid";

const TokenCard = ({
  token,
  handleRemove,
}: {
  token: IToken;
  handleRemove?: () => void;
}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body p-6">
        <h2 className="card-title">Symbol: {token.symbol}</h2>
        {token.type === "ETH" && <ETHCard token={token} />}
        {token.type !== "ETH" && <ERCCard token={token} />}
        <div className="card-actions justify-end">
          {handleRemove && (
            <button className="btn btn-sm btn-ghost" onClick={handleRemove}>
              remove
              <TrashIcon className="w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ETHCard = ({ token }: { token: INativeToken }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image src={EthLogo} alt={"eth logo"} />
    </div>
  );
};

const ERCCard = ({ token }: { token: IERCToken }) => {
  return (
    <>
      <a
        className="link link-hover"
        href={"https://etherscan.io/token/"} // + token.address}
        target="_blank"
      >
        Address:{" "}
        {token.address.substring(0, 4) +
          "..." +
          token.address.substring(35, 40)}
      </a>
      <p>
        <TokenBadge token={token} />
      </p>
    </>
  );
};

export default TokenCard;
