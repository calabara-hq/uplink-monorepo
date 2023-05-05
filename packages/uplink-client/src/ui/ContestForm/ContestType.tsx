import { BlockWrapper } from "./ContestForm";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { ContestBuilderProps } from "@/app/contestbuilder/contestHandler";
import InfoAlert from "../InfoAlert/InfoAlert";

const ContestType = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <BlockWrapper title="Choose a template">
      <InfoAlert>
        <p>Select what type of Contest you'd like to run</p>
      </InfoAlert>
      <div className="flex flex-col w-full lg:flex-row mt-2">
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              state.type === "standard" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-success" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "standard" });
            }}
            className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
              state.type === "standard" ? "border-success btn-active focus:border-2 focus:border-success shadow-box" : ""
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
            <CheckBadgeIcon className="w-8 text-twitter" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "twitter" });
            }}
            className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
              state.type === "twitter" ? "border-twitter btn-active focus:border-2 focus:border-twitter shadow-box" : ""
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
