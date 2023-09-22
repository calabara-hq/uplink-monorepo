import Link from "next/link";
import Image from "next/image";
import { BiPencil, BiWorld } from "react-icons/bi";
import { FaTwitter } from "react-icons/fa";
import { Metadata } from "next";
import ListContests from "./ListContests";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import fetchSpaces from "@/lib/fetch/fetchSpaces";
import fetchSpaceContests from "@/lib/fetch/fetchSpaceContests";
import SwrProvider from "@/providers/SwrProvider";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  const name = params.name;
  const space = await fetchSingleSpace(name);
  return {
    title: `${space.displayName}`,
    description: `${space.displayName} on Uplink`,
    openGraph: {
      title: `${space.displayName}`,
      description: `Create with ${space.displayName} on Uplink`,
      images: [
        {
          url: `${space.logoUrl}`,
          width: 600,
          height: 600,
          alt: `${space.displayName} logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

const SpaceInfo = async ({ name }: { name: string }) => {
  const data = await fetchSingleSpace(name);
  const { id, displayName, logoUrl, twitter, website } = data;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="avatar">
        <div className="w-48 rounded-xl bg-base-100">
          <Image
            src={logoUrl}
            alt={"org avatar"}
            width={192}
            height={192}
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row gap-2">
          <h2 className="card-title text-3xl text-center">{displayName}</h2>
        </div>
        <div className="flex flex-row gap-2">
          {twitter && (
            <Link
              href={`https://twitter.com/${twitter}`}
              target="_blank"
              className="link link-neutral "
              prefetch={false}
            >
              <FaTwitter className="w-6 h-6" />
            </Link>
          )}
          {website && (
            <Link
              href={`${website}`}
              target="_blank"
              className="link link-neutral"
              prefetch={false}
            >
              <BiWorld className="w-6 h-6" />
            </Link>
          )}
          <Link
            href={`/spacebuilder/edit/${name}`}
            className="link link-neutral"
          >
            <BiPencil className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default async function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const contests = await fetchSpaceContests(params.name);
    const fallback = {
      [`space/${params.name}/contests`]: contests,
    };

    return (
      <div className="flex flex-col md:flex-row m-auto py-6 w-11/12 gap-4">
        <div className="flex flex-col w-full md:w-56 gap-4">
          {/*@ts-expect-error */}
          <SpaceInfo name={name} />
          {/* <Stats /> */}
        </div>
        <div className="flex flex-col flex-grow">
          <SwrProvider fallback={fallback}>
            <ListContests spaceName={name} />
          </SwrProvider>
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <h1 className="text-white">oops, we couldnt find that space!</h1>;
  }
}

// const Stats = () => {
//   return (
//     <div className="stats stats-horizontal md:stats-vertical w-full bg-transparent border-2 border-border shadow-box">
//       <div className="stat">
//         <div className="stat-figure text-primary">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="inline-block w-8 h-8 stroke-current"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//             ></path>
//           </svg>
//         </div>
//         <div className="stat-title">ETH rewards</div>
//         <div className="stat-value text-primary">25.6K</div>
//         <div className="stat-desc"></div>
//       </div>

//       <div className="stat">
//         <div className="stat-figure text-secondary">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="inline-block w-8 h-8 stroke-current"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M13 10V3L4 14h7v7l9-11h-7z"
//             ></path>
//           </svg>
//         </div>
//         <div className="stat-title">ERC rewards</div>
//         <div className="stat-value text-secondary">2.6M</div>
//         <div className="stat-desc">tokens + nfts</div>
//       </div>
//     </div>
//   );
// };
