import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import Sidebar from "@/ui/SideBar/SideBar";
import ToastProvider from "@/providers/ToastProvider";
import MobileNav from "@/ui/MobileNav/MobileNav";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { PolyfillContext } from "@/providers/PolyfillContext";

// export const runtime = "edge";
// export const preferredRegion = "iad1";

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

const Footer = () => {

  return (
    <div className="flex flex-col w-[90vw] m-auto mt-16 mb-10 h-fit bg-base justify-center text-white gap-2">

      <div className="flex flex-row gap-2">
        <a className="text-t1" href="https://docs.uplink.wtf" target="_blank">Documentation</a>
        <a className="text-t1" href="https://discord.gg/yG5w2YT4BD" target="_blank">Support</a>
      </div>
      <div className="bg-base-100 w-full h-0.5" />

      <div className="flex flex-row gap-2">
        <a className="bg-base-100 rounded-full p-2 text-t1" href="https://twitter.com/uplinkwtf" target="_blank">
          <FaTwitter className="w-4 h-4" />
        </a>
        <a className="bg-base-100 rounded-full p-2 text-t1" href="https://discord.gg/yG5w2YT4BD" target="_blank">
          <FaDiscord className="w-4 h-4" />
        </a>
        <a className="bg-base-100 rounded-full p-2 text-t1" href="https://github.com/calabara-hq/uplink-monorepo" target="_blank">
          <FaGithub className="w-4 h-4" />
        </a>
        <a className="bg-base-100 rounded-full p-2 text-t1" href="https://warpcast.com/~/channel/uplink" target="_blank">
          <svg width="16" height="16" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" fill="#FFFFFF" />
            <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill="#FFFFFF" />
            <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" fill="#FFFFFF" />
          </svg>
        </a>
      </div>
      <div className="flex flex-col items-center md:flex-row">
        <p className="text-t2">2024 &#169; Calabara, Inc.</p>

        <span className="flex items-center gap-1 md:ml-auto">
          <p className=" text-t2">A public good from</p>
          <a className="flex items-center gap-1" target="_blank" href="https://nouns.wtf">
            <div className="w-8 h-8">
              <svg
                width="40"
                height="30"
                viewBox="0 0 160 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="crispEdges"
              >
                <path d="M90 0H30V10H90V0Z" fill={"#D53C5E"} />
                <path d="M160 0H100V10H160V0Z" fill={"#D53C5E"} />
                <path d="M40 10H30V20H40V10Z" fill={"#D53C5E"} />
                <path d="M60 10H40V20H60V10Z" fill="white" />
                <path d="M80 10H60V20H80V10Z" fill="black" />
                <path d="M90 10H80V20H90V10Z" fill={"#D53C5E"} />
                <path d="M110 10H100V20H110V10Z" fill={"#D53C5E"} />
                <path d="M130 10H110V20H130V10Z" fill="white" />
                <path d="M150 10H130V20H150V10Z" fill="black" />
                <path d="M160 10H150V20H160V10Z" fill={"#D53C5E"} />
                <path d="M40 20H0V30H40V20Z" fill={"#D53C5E"} />
                <path d="M60 20H40V30H60V20Z" fill="white" />
                <path d="M80 20H60V30H80V20Z" fill="black" />
                <path d="M110 20H80V30H110V20Z" fill={"#D53C5E"} />
                <path d="M130 20H110V30H130V20Z" fill="white" />
                <path d="M150 20H130V30H150V20Z" fill="black" />
                <path d="M160 20H150V30H160V20Z" fill={"#D53C5E"} />
                <path d="M10 30H0V40H10V30Z" fill={"#D53C5E"} />
                <path d="M40 30H30V40H40V30Z" fill={"#D53C5E"} />
                <path d="M60 30H40V40H60V30Z" fill="white" />
                <path d="M80 30H60V40H80V30Z" fill="black" />
                <path d="M90 30H80V40H90V30Z" fill={"#D53C5E"} />
                <path d="M110 30H100V40H110V30Z" fill={"#D53C5E"} />
                <path d="M130 30H110V40H130V30Z" fill="white" />
                <path d="M150 30H130V40H150V30Z" fill="black" />
                <path d="M160 30H150V40H160V30Z" fill={"#D53C5E"} />
                <path d="M10 40H0V50H10V40Z" fill={"#D53C5E"} />
                <path d="M40 40H30V50H40V40Z" fill={"#D53C5E"} />
                <path d="M60 40H40V50H60V40Z" fill="white" />
                <path d="M80 40H60V50H80V40Z" fill="black" />
                <path d="M90 40H80V50H90V40Z" fill={"#D53C5E"} />
                <path d="M110 40H100V50H110V40Z" fill={"#D53C5E"} />
                <path d="M130 40H110V50H130V40Z" fill="white" />
                <path d="M150 40H130V50H150V40Z" fill="black" />
                <path d="M160 40H150V50H160V40Z" fill={"#D53C5E"} />
                <path d="M90 50H30V60H90V50Z" fill={"#D53C5E"} />
                <path d="M160 50H100V60H160V50Z" fill={"#D53C5E"} />
              </svg>
            </div>
            <p className="font-bold ml-2 text-[#D53C5E]">Nouns.</p>
          </a>
        </span>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="uplinkDark" className="bg-base stars small">
      <head />
      <body>
        <WalletProvider refetchInterval={60} session={undefined}>
          <ToastProvider>
            <PolyfillContext>
              <div className="h-full">
                <div className="hidden md:flex h-full w-[64px] z-30 flex-col fixed inset-y-0">
                  <Sidebar />
                </div>
                <div className="btm-nav z-20 md:hidden shadow-[0_35px_60px_15px_black] bg-base">
                  <MobileNav />
                </div>
                <main className="pb-20 md:pb-0 md:pl-[64px]">
                  <Nav />
                  <div className="min-h-[100vh]">
                    {children}
                  </div>
                  <Footer />
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
