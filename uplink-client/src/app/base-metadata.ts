import type { Metadata } from "next";
export const baseMetadata: Metadata = {
    title: "Uplink",
    description: "Crafted for creators.",
    icons: {
        icon: "/uplink-logo.svg",
    },
    openGraph: {
        title: "Uplink",
        description: "Crafted for creators.",
        url: "https://uplink.wtf",
        siteName: "Uplink",
        images: [
            {
                url: "/uplink-logo.png",
                width: 400,
                height: 600,
                alt: "Uplink",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};