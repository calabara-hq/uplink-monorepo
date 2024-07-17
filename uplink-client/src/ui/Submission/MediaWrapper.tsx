export const ImageWrapper = ({ children }) => {
  return (
    <div className="w-full relative pt-[100%]">
      <figure className="absolute inset-0 overflow-hidden">{children}</figure>
    </div>
  );
};




// export const RectVideoWrapper = ({ children }) => {
//   return (
//     <div className="w-full relative pt-[66%]">
//       <figure className="absolute inset-0 overflow-hidden">{children}</figure>
//     </div>
//   );
// };

export const RectVideoWrapper = ({ children }) => {
  return (
    <div className="w-full relative">
      <figure className="inset-0 overflow-hidden">{children}</figure>
    </div>
  );
};


export const SquareVideoWrapper = ({ children }) => {
  return (
    <div className="w-full relative pt-[100%]">
      <figure className="absolute inset-0 overflow-hidden">{children}</figure>
    </div>
  );
}