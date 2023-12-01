const LoadingDialog = ({ springUp }: { springUp?: boolean }) => {
  return (
    <div
      className={`${
        springUp && "animate-springUp"
      } flex flex-col gap-2 w-full h-[50vh] items-center justify-center`}
    >
      <p className="text-lg text-t1 font-semibold">Starting up the studio</p>
      <div
        className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    </div>
  );
};

export default LoadingDialog;
