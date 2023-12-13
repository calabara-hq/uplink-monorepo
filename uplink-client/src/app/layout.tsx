import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import Sidebar from "@/ui/SideBar/SideBar";
import ToastProvider from "@/providers/ToastProvider";
import MobileNav from "@/ui/MobileNav/MobileNav";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_CLIENT_URL!),
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
        url: "/opengraph.png",
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
    <html lang="en" data-theme="uplinkDark" className="bg-base">
      <head />
      <body>
        <WalletProvider refetchInterval={60} session={undefined}>
          <ToastProvider>
            <div className="h-full">
              <div className="hidden md:flex h-full w-[64px] z-30 flex-col fixed inset-y-0">
                <Sidebar />
              </div>
              <div className="btm-nav z-20 md:hidden shadow-[0_35px_60px_15px_black]">
                <MobileNav />
              </div>
              <main className="pb-20 md:pb-0 md:pl-[64px] h-full">
                <Nav />
                {children}
                <Analytics />
              </main>
            </div>
          </ToastProvider>
        </WalletProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
