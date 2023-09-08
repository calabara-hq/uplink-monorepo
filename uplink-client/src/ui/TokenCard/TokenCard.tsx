import { IToken, INativeToken, IERCToken } from "@/types/token";
import TokenBadge from "../TokenBadge/TokenBadge";
import Image from "next/image";
import EthLogo from "../../../public/eth-logo.png";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { LiaEthereum } from "react-icons/lia";
const TokenCard = ({
  token,
  handleRemove,
  editCallback,
  children,
}: {
  token: IToken;
  handleRemove?: () => void;
  editCallback?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <div className="card bg-base-100 p-2">
      <div className="card-body gap-2 p-0">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-t1 text-xl font-bold pl-3">{token.symbol}</p>
          <TokenBadge token={token} />
          {editCallback && (
            <button
              className="btn btn-xs btn-ghost text-t2"
              onClick={editCallback}
            >
              <HiPencil className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="pl-3">{children}</div>
        <div className="flex flex-row items-center justify-between gap-2">
          {token.type !== "ETH" && (
            <a
              className="btn btn-sm btn-ghost link lowercase text-t2"
              href={`https://etherscan.io/token/${token.address}`}
              target="_blank"
            >
              {token.address.substring(0, 4) +
                "..." +
                token.address.substring(35, 40)}
            </a>
          )}
          {handleRemove && (
            <button
              className="btn btn-xs btn-ghost text-t2 ml-auto"
              onClick={handleRemove}
            >
              <HiTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
