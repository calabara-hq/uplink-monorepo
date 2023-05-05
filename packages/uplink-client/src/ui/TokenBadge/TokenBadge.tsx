import { IToken, INativeToken, IERCToken } from "@/types/token";

const TokenBadge = ({ token }: { token?: IToken }) => {
    if (!token) return null;
    
  const type = token.type;
  if (type === "ETH") {
    return <div className="badge badge-neutral badge-outline lg:badge-lg font-medium">Ethereuem</div>;

  }
  if (type === "ERC20") {
    return <div className="badge badge-primary lg:badge-lg font-medium">ERC-20</div>;
  }
  if (type === "ERC721") {
    return <div className="badge badge-secondary lg:badge-lg font-medium">ERC-721</div>;
  }
  if (type === "ERC1155") {
    return <div className="badge badge-accent lg:badge-lg font-medium">ERC-1155</div>;
  }
  return null;
};

export default TokenBadge;
