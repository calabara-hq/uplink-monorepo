import { IToken } from "@/types/token";

const TokenCard = ({
  token,
  handleRemove,
}: {
  token: IToken;
  handleRemove?: () => void;
}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        {handleRemove && <button onClick={handleRemove}>remove</button>}
        <h2 className="card-title">{token.symbol}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
      </div>
    </div>
  );
};

export default TokenCard;
