export default function Loading() {
  return (
    <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
      <div
        className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    </div>
  );
}
