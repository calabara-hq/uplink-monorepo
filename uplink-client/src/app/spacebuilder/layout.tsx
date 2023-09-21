import { Metadata } from "next";
import { baseMetadata } from "../base-metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  description: "Space Builder",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Space Builder",
    description: "Create a space on Uplink",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full md:w-3/5 lg:w-2/5 m-auto">{children}</div>;
}
