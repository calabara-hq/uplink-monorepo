import { BlockWrapper } from "./ContestForm";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { ContestBuilderProps } from "@/lib/contestHandler";

const categories = [
  "art",
  "music",
  "writing",
  "video",
  "photography",
  "design",
  "development",
  "other",
];

const ContestMetadata = ({
  state,
  dispatch,
}: {
  state: ContestBuilderProps;
  dispatch: React.Dispatch<any>;
}) => {
  const { type, category } = state.metadata;

  return (
    <BlockWrapper
      title="Choose a template"
      info="Select what type of Contest you'd like to run"
    >
      <div className="flex flex-col w-full lg:flex-row mt-2">
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "standard" ? "visible" : "hidden"
            }`}
          >
            <CheckBadgeIcon className="w-8 text-success" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "standard" });
            }}
            className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
              type === "standard"
                ? "border-success border-2 hover:border-success hover:bg-transparent"
                : ""
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
            <CheckBadgeIcon className="w-8 text-twitter" />
          </span>
          <button
            onClick={() => {
              dispatch({ type: "setType", payload: "twitter" });
            }}
            className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
              type === "twitter"
                ? "border-twitter border-2 hover:border-twitter hover:bg-transparent"
                : ""
            }`}
          >
            twitter contest
          </button>
        </div>
        {state.errors.metadata?.type && (
          <p className="text-red-500">{state.errors.metadata?.type}</p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 w-full gap-4">
        {categories.map((el, index) => (
          <button
            key={index}
            onClick={() => {
              dispatch({ type: "setCategory", payload: el });
            }}
            className={`btn btn-ghost border-2 border-border h-full card place-items-center ${
              el === category
                ? "border-success border-2 hover:border-success hover:bg-transparent"
                : ""
            }`}
          >
            {el}
          </button>
        ))}
        {state.errors.metadata?.category && (
          <p className="text-red-500">{state.errors.metadata?.category}</p>
        )}
      </div>
    </BlockWrapper>
  );
};

export default ContestMetadata;
