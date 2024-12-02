import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { Suspense } from "react";
import { CreateContestV2 } from "./client";

const Skeleton = () => {
  return (
    <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
      <div
        className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    </div>
  );
}

export default async function Page({ params }: { params: { name: string } }) {

  const space = await fetchSingleSpace(params.name);


  return (
    <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
      <Suspense fallback={<Skeleton />} >
        <CreateContestV2 space={space} />
      </Suspense>
    </div>
  )

}
