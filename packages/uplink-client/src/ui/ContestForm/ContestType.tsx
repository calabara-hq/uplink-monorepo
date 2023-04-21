import { BlockWrapper } from "./ContestForm";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { ContestBuilderProps } from "@/app/contestbuilder/contestHandler";

const ContestType = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Choose a template">
      <div className="flex flex-col w-full lg:flex-row">
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              state.type === "standard" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-green-400" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "standard" });
            }}
            className={`btn h-full card bg-base-300 border-2 rounded-box place-items-center ${
              state.type === "standard" ? "border-green-400" : ""
            }`}
          >
            standard contest
          </button>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              state.type === "twitter" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-blue-400" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "twitter" });
            }}
            className={`btn h-full card bg-base-300 border-2 rounded-box place-items-center ${
              state.type === "twitter" ? "border-blue-400" : ""
            }`}
          >
            twitter contest
          </button>
        </div>
        {state.errors.type && (
          <p className="text-red-500">{state.errors.type}</p>
        )}
      </div>
    </BlockWrapper>
  );
};

export default ContestType;
