import { BlockWrapper } from "./Entrypoint";
import { HiCheckBadge } from "react-icons/hi2";
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
    <BlockWrapper title="Contest type & category">
      {errors.type && <p className="text-error self-start">{errors.type}</p>}

      <div className="flex flex-col w-full lg:flex-row mt-2">
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "standard" ? "visible" : "hidden"
            }`}
          >
            <HiCheckBadge className="w-8 h-8 text-success" />
          </span>
          <button
            onClick={() => {
              handleTypeChange("standard");
            }}
            className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
              type === "standard"
                ? "border-success border-2 hover:border-success hover:bg-transparent"
                : ""
            }`}
          >
            <p>standard contest</p>
          </button>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="indicator grid flex-grow w-full h-32">
          <span
            className={`indicator-item badge bg-transparent border-none ${
              type === "twitter" ? "visible" : "hidden"
            }`}
          >
            <HiCheckBadge className="w-8 h-8 text-primary" />
          </span>
          <button
            onClick={() => {
              handleTypeChange("twitter");
            }}
            className={`btn btn-ghost border-2 border-border h-full card rounded-box place-items-center ${
              type === "twitter"
                ? "border-primary border-2 hover:border-primary hover:bg-transparent"
                : ""
            }`}
          >
            twitter contest
          </button>
        </div>
      </div>
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
            className={`btn btn-ghost border-2 border-border h-full card place-items-center ${
              el === category
                ? "border-success border-2 hover:border-success hover:bg-transparent"
                : ""
            }`}
          >
            {el}
          </button>
        ))}
      </div>
      <button
        onClick={onSubmit}
        className="btn btn-primary lowercase mt-4 self-end"
      >
        Confirm
      </button>
    </BlockWrapper>
  );
};

export default ContestMetadata;
