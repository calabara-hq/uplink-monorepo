import { Metadata } from "next";
export const metadata: Metadata = {
  openGraph: {
    title: "Uplink",
    description: "Create a space on Uplink.",
    url: "/",
    siteName: "Uplink",
    images: [
      {
        url: "/opengraph.png",
        width: 400,
        height: 600,
        alt: "Uplink",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full md:w-3/5 lg:w-2/5 m-auto">{children}</div>;
}
