import { IToken } from "@/types/token";

const TokenCard = ({
  token,
  dispatch,
}: {
  token: IToken;
  dispatch: React.Dispatch<any>;
}) => {
  const handleRemove = () => {
    dispatch({
      type: "removeSubmitterReward",
      payload: { token: token },
    });
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <button onClick={handleRemove}>remove</button>
        <h2 className="card-title">{token.symbol}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
      </div>
    </div>
  );
};

export default TokenCard;
