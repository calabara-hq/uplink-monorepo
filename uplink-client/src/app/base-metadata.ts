import type { Metadata } from "next";
export const baseMetadata: Metadata = {
    metadataBase: new URL(process.env.VERCEL_URL || "https://uplink.wtf"),
    title: "Uplink",
    description: "Crafted for creators.",
    icons: {
        icon: "/uplink-logo.svg",
    },
    openGraph: {
        title: "Uplink",
        description: "Crafted for creators.",
        url: "/",
        siteName: "Uplink",
        images: [
            {
                url: "",
                width: 400,
                height: 600,
                alt: "Uplink",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};