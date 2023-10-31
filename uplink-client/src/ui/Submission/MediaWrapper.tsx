export const ImageWrapper = ({ children }) => {
  return (
    <div className="w-full relative pt-[100%]">
      <figure className="absolute inset-0 overflow-hidden">{children}</figure>
    </div>
  );
};

export const VideoWrapper = ({ children }) => {
  return (
    <div className="w-full relative pt-[100%]">
      <figure className="absolute inset-0 overflow-hidden">{children}</figure>
    </div>
  );
};
