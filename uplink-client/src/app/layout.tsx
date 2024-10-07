import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import Sidebar from "@/ui/SideBar/SideBar";
import ToastProvider from "@/providers/ToastProvider";
import MobileNav from "@/ui/Nav/MobileNav";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { PolyfillContext } from "@/providers/PolyfillContext";

// export const runtime = "edge";
// export const preferredRegion = "iad1";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_CLIENT_URL!),
  title: "Uplink",
  description: "Build with your favorite communities on uplink",
  icons: {
    icon: "/uplink-logo.svg",
  },
  openGraph: {
    title: "Uplink",
    description: "Build with your favorite communities on uplink",
    url: "/",
    siteName: "Uplink",
    images: [
      {
        url: "/ogimage.png",
        width: 1200,
        height: 600,
        alt: "Uplink",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-base">
      <head />
      <body>
        <WalletProvider refetchInterval={60} session={undefined}>
          <ToastProvider>
            <PolyfillContext>
              <div className="h-full">
                <div className="hidden sm:flex h-full w-[64px] z-30 flex-col fixed inset-y-0">
                  <Sidebar />
                </div>
                <MobileNav />
                <main className="pb-20 sm:pb-0 sm:pl-[64px] mb-16">
                  <Nav />
                  <div className="min-h-[100vh]">
                    {children}
                  </div>
                </main>
              </div>
            </PolyfillContext>
          </ToastProvider>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
