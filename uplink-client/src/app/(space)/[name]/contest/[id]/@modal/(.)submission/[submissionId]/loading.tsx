export default function Loading() {
  return (
    <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
      <div className="animate-springUp flex items-center justify-center">
        <div
          className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        />
      </div>
    </div>
  );
}
