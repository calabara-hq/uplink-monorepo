import { IToken, INativeToken, IERCToken } from "@/types/token";

const TokenBadge = ({ token }: { token: IToken }) => {
  const type = token.type;
  if (type === "ETH") {
    return <div className="badge badge-neutral badge-outline badge-lg">Ethereuem</div>;

  }
  if (type === "ERC20") {
    return <div className="badge badge-primary badge-lg">ERC20</div>;
  }
  if (type === "ERC721") {
    return <div className="badge badge-secondary badge-lg">ERC721</div>;
  }
  if (type === "ERC1155") {
    return <div className="badge badge-accent badge-lg">ERC1155</div>;
  }
  return null;
};

export default TokenBadge;
