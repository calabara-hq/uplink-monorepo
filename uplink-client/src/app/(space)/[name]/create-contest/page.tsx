import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import ContestForm from "@/ui/ContestForm/Entrypoint";
import { Suspense } from "react";

const PageContent = async ({ params }: { params: { name: string } }) => {
  const { id, spaceTokens } = await fetchSingleSpace(params.name);
  return (
    <ContestForm
      spaceName={params.name}
      spaceId={id}
      spaceTokens={spaceTokens.map((t) => t.token)}
    />
  );
}

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
  return (
    <div className="w-11/12 h-full lg:w-9/12 m-auto">
      <Suspense fallback={<Skeleton />}>
        <PageContent params={params} />
      </Suspense>
    </div>
  );
}
