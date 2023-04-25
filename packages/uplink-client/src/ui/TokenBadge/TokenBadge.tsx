import { IToken, INativeToken, IERCToken } from "@/types/token";

const TokenBadge = ({ token }: { token: IToken }) => {
  const type = token.type;
  if (type === "ETH") {
    return <div className="badge badge-neutral badge-outline badge-lg">Ethereuem</div>;

  }
  if (type === "ERC20") {
    return <div className="badge badge-primary badge-lg">ERC-20</div>;
  }
  if (type === "ERC721") {
    return <div className="badge badge-secondary badge-lg">ERC-721</div>;
  }
  if (type === "ERC1155") {
    return <div className="badge badge-accent badge-lg">ERC-1155</div>;
  }
  return null;
};

export default TokenBadge;
