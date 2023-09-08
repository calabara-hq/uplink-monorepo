import Link from "next/link";
import Image from "next/image";
import { HiPlus } from "react-icons/hi2";

const getSpaces = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Spaces{
        spaces{
            name
            displayName
            members
            logoUrl
        }
    }`,
    }),
    next: { tags: ["spaces"], revalidate: 60 },
  })
    .then((res) => res.json())
    .then((res) => res.data.spaces);
};

const AllSpaces = ({ spaces }: any) => {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full ">
      {spaces.map((space: any, index: number) => {
        return (
          <Link
            key={index}
            href={`${space.name}`}
            prefetch={true}
            className="flex flex-col will-change-transform rounded-xl bg-base-100 overflow-hidden transform transition-transform duration-300 hover:-translate-y-2.5 hover:translate-x-0"
          >
            <div className="relative media-grid-item">
              <figure className="absolute inset-0 overflow-hidden rounded-b-2xl">
                <Image
                  src={space.logoUrl}
                  alt="space logo"
                  fill
                  className="object-cover w-full"
                  sizes="25vw"
                />
              </figure>
              <div className="absolute flex items-end bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black rounded-b-lg">
                <h2
                  className={`card-title w-full truncate text-t1 p-2 text-lg md:text-xl ${
                    space.displayName.length > 25 ? "text-xl" : "text-2xl"
                  }`}
                >
                  {space.displayName}
                </h2>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default async function Page() {
  const spaces = await getSpaces();
  return (
    <div className="flex flex-col w-11/12 lg:w-9/12 m-auto justify-center py-12 gap-4">
      <div className="flex items-center gap-4 justify-end font-bold">
        <Link
          className="btn btn-primary btn-outline normal-case"
          href="/spacebuilder/create"
          draggable={false}
        >
          <HiPlus className="w-6 h-6" />
          <p className="pl-2">New Space</p>
        </Link>
      </div>
      <AllSpaces spaces={spaces} />
    </div>
  );
}
