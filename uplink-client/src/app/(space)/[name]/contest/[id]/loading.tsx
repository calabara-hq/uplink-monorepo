export default function Loading() {
  return (
    <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
      <div className="flex w-full gap-6 ">
        <div className="hidden xl:block w-1/4 max-w-[300px] h-[50vh] flex-shrink-0 border border-border rounded-lg">
          <div className="flex flex-col justify-between rounded-lg w-full">
            <div className="space-y-2 p-4">
              <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
              <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
              <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
            </div>
            <div className="space-y-2 p-4">
              <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
              <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
              <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
            </div>
            <div className="space-y-2 p-4">
              <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
              <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
              <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
            </div>
          </div>
        </div>
        <div className="w-[60%] flex-grow ">
          <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
            <div className="grid grid-cols-1 w-full gap-2">
              <div className="w-full ml-auto">
                <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
                  <div className="flex flex-col gap-2">
                    <div className="shimmer h-8 w-64 bg-base-100 rounded-lg" />
                    <div className="flex gap-2 items-center">
                      <div className="rounded-full w-8 h-8 shimmer bg-base-100" />
                      <div className="rounded-lg w-16 h-5 shimmer bg-base-100" />
                      <div className="rounded-xl w-10 h-5 shimmer bg-base-100" />
                      <div className="rounded-xl w-10 h-5 shimmer bg-base-100" />
                    </div>
                    <div className="shimmer h-4 w-80 bg-base-100 rounded-lg" />
                    <div className="shimmer h-4 w-80 bg-base-100 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="w-full h-0.5 bg-base-100" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex w-full justify-evenly items-center">
                <div className="w-8/12 m-auto sm:w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  sm:auto-rows-fr ">
                  <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
                    <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                    <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                    <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                  </div>
                  <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
                    <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                    <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                    <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                  </div>
                  <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
                    <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                    <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                    <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                  </div>
                  <div className="col-span-4 space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px]">
                    <div className="h-5 w-2/3 rounded-lg bg-base-100" />
                    <div className="h-3 w-1/3 rounded-lg bg-base-100" />
                    <div className="h-4 w-3/4 rounded-lg bg-base-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-0 lg:w-1/12" />
    </div>
  );
}
