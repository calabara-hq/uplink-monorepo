import dynamic from "next/dynamic";
import { RectVideoWrapper, SquareVideoWrapper } from "../Submission/MediaWrapper";

const InteractivePlayer = dynamic(() => import("./InteractiveVideoPlayer"), {
  ssr: false,
  loading: () => <SquareSpinLoader />,
});

const StandardPlayer = dynamic(() => import("./StandardVideoPlayer"), {
  ssr: false,
  loading: () => <RectSpinLoader />,
});

const SquareSpinLoader = () => {
  return (
    <div className="w-full h-fit flex items-center justify-center aspect-square bg-black rounded-xl">
      <div
        className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    </div>
  );
};

const RectSpinLoader = () => {
  return (
    <div className="w-full h-fit flex items-center justify-center aspect-video bg-black rounded-xl">
      <div
        className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    </div>
  );
};

export const RenderStandardVideoWithLoader = ({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string;
  posterUrl: string;
}) => {
  return (
    <RectVideoWrapper>
      <StandardPlayer {...{ videoUrl, posterUrl }} />
    </RectVideoWrapper>
  );
};

export const RenderInteractiveVideoWithLoader = ({
  videoUrl,
  posterUrl,
  isActive,
}: {
  videoUrl: string;
  posterUrl: string;
  isActive: boolean;
}) => {
  return (
    <SquareVideoWrapper>
      <InteractivePlayer {...{ videoUrl, posterUrl, isActive }} />
    </SquareVideoWrapper>
  );
};
