import Link from "next/link";
import Image from "next/image";
import { HiHome, HiPlus } from "react-icons/hi2";

const getSpaces = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
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
  return data;
};

const AllSpaces = ({ spaces }: any) => {
  return (
    <div
      className="grid gap-8 py-6
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-2/3 md:w-10/12 lg:w-full mr-auto ml-auto "
    >
      {spaces.map((space: any, index: number) => {
        return (
          <Link
            key={index}
            href={`${space.name}`}
            prefetch={true}
            className="card card-compact box-border will-change-transform rounded-xl bg-base-100 border border-border overflow-hidden transform transition-transform duration-300 hover:-translate-y-2.5 hover:translate-x-0"
          >
            <figure className="relative h-56 rounded-t-xl">
              <Image
                src={space.logoUrl}
                alt="space logo"
                fill
                className="object-cover w-full"
              />
            </figure>
            <div className="card-body h-fit rounded-b-xl w-full">
              <h2
                className={`card-title w-full truncate ${
                  space.name.length > 25 ? "text-xl" : "text-2xl"
                }`}
              >
                {space.name}
              </h2>
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
    <div className="flex flex-col w-full justify-center m-auto py-12 lg:w-4/5 gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center lg:justify-end font-bold">
        <Link
          className="btn btn-primary btn-outline normal-case"
          href="/spacebuilder/create"
        >
          <HiPlus className="w-6 h-6" />
          <p className="pl-2">New Space</p>
        </Link>
      </div>
      <AllSpaces spaces={spaces} />
    </div>
  );
}
