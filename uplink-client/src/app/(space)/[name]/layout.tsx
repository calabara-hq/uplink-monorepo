import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { Metadata } from "next";

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
          url: `api/space?name=${name}`,
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
