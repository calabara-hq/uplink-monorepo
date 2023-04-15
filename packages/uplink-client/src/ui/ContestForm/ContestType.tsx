import { BlockWrapper } from "./ContestForm";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

const ContestType = ({
  type,
  dispatch,
}: {
  type: string | null;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Choose a template">
      <div className="flex flex-col w-full lg:flex-row">
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "standard" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-green-400" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "standard" });
            }}
            className={`btn h-full card bg-base-300 border-2 rounded-box place-items-center ${
              type === "standard" ? "border-green-400" : ""
            }`}
          >
            standard contest
          </button>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "twitter" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-blue-400" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "twitter" });
            }}
            className={`btn h-full card bg-base-300 border-2 rounded-box place-items-center ${
              type === "twitter" ? "border-blue-400" : ""
            }`}
          >
            twitter contest
          </button>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default ContestType;
