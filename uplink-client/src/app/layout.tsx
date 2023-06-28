import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";

import Sidebar from "@/ui/SideBar/SideBar";
import ToastProvider from "@/providers/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="uplinkDark">
      <head />
      <body className="bg-base min-h-screen overflow-hidden">
        <WalletProvider refetchInterval={60} session={undefined}>
          <div className="flex flex-col md:grid md:grid-cols-[64px_auto] h-screen">
            <Sidebar />
            <ToastProvider>
              <main className="overflow-auto">
                <Nav />
                <div className="flex flex-col flex-grow items-center justify-center pb-20 md:pb-0">
                  {children}
                </div>
              </main>
            </ToastProvider>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
