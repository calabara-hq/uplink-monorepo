const Stack = ({
  layer1,
  layer2,
}: {
  layer1: React.ReactNode;
  layer2: React.ReactNode;
}) => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute flex flex-col justify-end top-0 right-0 w-5/6 h-full bg-base-100 z-1 rounded-xl p-2">
        {layer1}
      </div>
      <div className="absolute flex flex-col top-0 left-0 w-5/6 h-5/6 bg-base-200 z-2 rounded-xl p-2">
        {layer2}
      </div>
    </div>
  );
};

export default Stack;
