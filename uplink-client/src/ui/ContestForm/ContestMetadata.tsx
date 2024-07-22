import { BlockWrapper } from "./Entrypoint";
import { HiCheckBadge, HiInformationCircle } from "react-icons/hi2";
import { ContestCategory } from "@/types/contest";
import { useState } from "react";
import { validateMetadata, Metadata, MetadataError } from "./contestHandler";

const categories: ContestCategory[] = [
  "art",
  "music",
  "writing",
  "video",
  "photography",
  "design",
  "memes",
  "other"
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
    <BlockWrapper title="Contest Type">
      <div className="flex flex-col gap-6">


        <div className="flex flex-col gap-2">
          {errors.category && (
            <p className="text-error self-start">{errors.category}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {categories.map((el, index) => (
              <button
                key={index}
                onClick={() => {
                  handleCategoryChange(el);
                }}
                className={`btn btn-ghost normal-case border-2 border-border h-full   ${el === category
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
