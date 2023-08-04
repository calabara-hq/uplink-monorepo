import { BiTime } from "react-icons/bi";

export type ContestCategory =
  | "art"
  | "music"
  | "writing"
  | "video"
  | "photography"
  | "design"
  | "development"
  | "other";

// return color for contest category
const contestCategoryColor = (contestCategory: ContestCategory) => {
  switch (contestCategory) {
    case "art":
      return "text-orange-300";
    case "music":
      return "text-yellow-300";
    case "writing":
      return "text-green-300";
    case "video":
      return "text-blue-300";
    case "photography":
      return "text-indigo-300";
    case "design":
      return "text-purple-300";
    case "development":
      return "text-pink-300";
    case "other":
      return "text-gray-300";
  }
};

export const CategoryLabel = ({ category }: { category: ContestCategory }) => {
  const categoryColor = contestCategoryColor(category);
  return (
    <p className={`badge badge-outline badge-md ${categoryColor}`}>
      {category}
    </p>
  );
};

export type ContestState = "pending" | "submitting" | "voting" | "closed";

// return color for contest state
const contestStatusColor = (contestState: ContestState) => {
  switch (contestState) {
    case "pending":
      return "text-gray-300";
    case "submitting":
      return "text-green-300";
    case "voting":
      return "text-yellow-300";
    case "closed":
      return "text-red-500";
  }
};

export const StatusLabel = ({ status }: { status: ContestState }) => {
  return (
    <p className={`badge badge-outline badge-md ${contestStatusColor(status)}`}>
      {status}
    </p>
  );
};

export const RemainingTimeLabel = ({
  remainingTime,
}: {
  remainingTime: string;
}) => {
  if (remainingTime)
    return (
      <div className="flex gap-1 text-sm text-gray-500 items-center">
        <BiTime className="h-4 w-4" />
        <p>
          <i>{remainingTime}</i>
        </p>
      </div>
    );
  else return null;
};
