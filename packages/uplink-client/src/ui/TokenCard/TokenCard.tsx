import { IToken, INativeToken, IERCToken } from "@/types/token";
import TokenBadge from "../TokenBadge/TokenBadge";
import Image from "next/image";
import EthLogo from "../../../public/eth-logo.png";
import {
  TrashIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";

const TokenCard = ({
  token,
  handleRemove,
}: {
  token: IToken;
  handleRemove?: () => void;
}) => {
  return (
    <div className="card w-full lg:w-1/4 bg-base-100 p-4 shadow-xl">
      <div className="card-body justify-between p-0">
        <h2 className="card-title">{token.symbol}</h2>
        {token.type === "ETH" && <ETHCard token={token} />}
        {token.type !== "ETH" && <ERCCard token={token} />}
        <div className="card-actions justify-end">
          {handleRemove && (
            <button className="btn btn-xs btn-ghost" onClick={handleRemove}>
              remove
              <TrashIcon className="w-4 ml-2" />
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
    <div className="flex flex-col items-end gap-2">
      <TokenBadge token={token} />

      <a
        className="btn btn-sm btn-ghost link"
        href={`https://etherscan.io/token/${token.address}`}
        target="_blank"
      >
        {" "}
        {token.address.substring(0, 4) +
          "..." +
          token.address.substring(35, 40)}
      </a>
    </div>
  );
};

export default TokenCard;
