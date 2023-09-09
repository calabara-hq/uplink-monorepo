import { BlockWrapper } from "./Entrypoint";
import { HiCheckBadge, HiInformationCircle } from "react-icons/hi2";
import { ContestCategory } from "@/ui/ContestLabels/ContestLabels";
import { useState } from "react";
import { validateMetadata, Metadata, MetadataError } from "./contestHandler";

const categories: ContestCategory[] = [
  "art",
  "music",
  "writing",
  "video",
  "photography",
  "design",
  "other",
];

const ContestMetadata = ({
  initialMetadata,
  handleConfirm,
  errors,
  setErrors,
}: {
  initialMetadata: Metadata;
  handleConfirm: (metadata: Metadata) => void;
  errors: MetadataError;
  setErrors: (errors: MetadataError) => void;
}) => {
  const [type, setType] = useState(initialMetadata.type);
  const [category, setCategory] = useState(initialMetadata.category);
  const handleTypeChange = (type: Metadata["type"]) => {
    setType(type);
    setErrors({ ...errors, type: "" });
  };

  const handleCategoryChange = (category: Metadata["category"]) => {
    setCategory(category);
    setErrors({ ...errors, category: "" });
  };

  const onSubmit = () => {
    const { errors, isError, data } = validateMetadata({ type, category });
    if (isError) return setErrors(errors);
    handleConfirm(data);
  };

  return (
    <BlockWrapper title="">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-t1">Contest Type</h1>
          {errors.type && (
            <p className="text-error self-start">{errors.type}</p>
          )}

          <div className="flex flex-col w-full lg:flex-row mt-2">
            <div className="indicator grid flex-grow w-full h-32">
              <span
                className={`indicator-item badge bg-transparent border-none ${
                  type === "standard" ? "visible" : "hidden"
                }`}
              >
                <HiCheckBadge className="w-8 h-8 text-success bg-base" />
              </span>
              <div
                className={`flex flex-col items-center justify-center gap-2 border-2 border-border h-full rounded-box cursor-pointer transform 
            transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform p-2 ${
              type === "standard"
                ? "border-success border-2 hover:border-success hover:bg-transparent"
                : ""
            }`}
                onClick={() => {
                  handleTypeChange("standard");
                }}
              >
                <h1 className="text-lg font-semibold text-center text-t1">
                  Standard Contest
                </h1>

                <p className="text-sm text-t2 text-center">
                  {`Create a prompt, set participation requirements, & configure rewards.
              Submitters respond to your prompt through Uplink.`}
                </p>
              </div>
            </div>
            <div className="divider lg:divider-horizontal">OR</div>
            <div className="indicator grid flex-grow w-full h-32">
              <span
                className={`indicator-item badge bg-transparent border-none ${
                  type === "twitter" ? "visible" : "hidden"
                }`}
              >
                <HiCheckBadge className="w-8 h-8 text-primary bg-base" />
              </span>
              <div
                className={`flex flex-col items-center justify-center gap-2 border-2 border-border h-full rounded-box cursor-pointer transform 
            transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform p-2 ${
              type === "twitter"
                ? "border-primary border-2 hover:border-primary hover:bg-transparent"
                : ""
            }`}
                onClick={() => {
                  handleTypeChange("twitter");
                }}
              >
                <h1 className="text-lg font-semibold text-center text-t1">
                  Twitter Contest
                </h1>

                <p className="text-sm text-t2 text-center">
                  {`Same as standard + user submissions will be auto-posted as
              quote-replies to a contest announcement tweet.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-t1">Category</h1>
          {errors.category && (
            <p className="text-error self-start">{errors.category}</p>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-5 w-full gap-4">
            {categories.map((el, index) => (
              <button
                key={index}
                onClick={() => {
                  handleCategoryChange(el);
                }}
                className={`btn btn-ghost normal-case border-2 border-border h-full card place-items-center ${
                  el === category
                    ? "border-purple-500 border-2 hover:border-purple-500 hover:bg-transparent"
                    : ""
                }`}
              >
                {el}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="btn btn-primary normal-case mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

export default ContestMetadata;
