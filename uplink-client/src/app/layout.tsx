import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";

import Sidebar from "@/ui/SideBar/SideBar";
import ToastProvider from "@/providers/ToastProvider";
import MobileNav from "@/ui/MobileNav/MobileNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="uplinkDark">
      <head />
      <body className="bg-base">
        <WalletProvider refetchInterval={60} session={undefined}>
          <ToastProvider>
            <div className="h-full">
              <div className="hidden md:flex h-full w-[64px] z-30 flex-col fixed inset-y-0">
                <Sidebar />
              </div>
              <div className="btm-nav z-10 md:hidden">
                <MobileNav />
              </div>
              <main className="pb-20 md:pb-0 md:pl-[64px] h-full">
                <Nav />
                {children}
              </main>
            </div>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
