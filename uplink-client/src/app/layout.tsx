import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import { headers } from "next/headers";
import { fetchData } from "@/utils/fetchData";

import Sidebar from "@/ui/SideBar/SideBar";
import ToastProvider from "@/providers/ToastProvider";
import { Toaster } from "react-hot-toast";

// pass cookies from request to the hub api and return a seession object
// this forces the top level layout to become a dynamic route, which may not be ideal
// https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#dynamic-rendering

const getInitialSession = async () => {
  const headersInstance = headers();
  const cookie = headersInstance.get("cookie");
  const session = await fetchData("/auth/session", cookie);
  console.log(session);
  return session;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInitialSession();

  return (
    <html lang="en" data-theme="uplinkDark">
      <head />
      <body className="bg-base min-h-screen overflow-hidden">
        <WalletProvider session={session}>
          <div className="flex flex-col md:grid md:grid-cols-[64px_auto] h-screen">
            <Sidebar />
            <ToastProvider>
              <main className="overflow-auto">
                <Nav />
                <div className="flex flex-col items-center justify-center pb-20 md:pb-0">
                  {children}
                </div>
              </main>
            </ToastProvider>
          </div>
        </WalletProvider>
      </body>
    </html>
  );

  return;
}

/*
  return (
    <html lang="en" data-theme="uplinkDark">
      <head />
      <body className="bg-base min-h-screen w-full">
        <WalletProvider session={session}>
          <div className="flex w-full h-screen ">
            <Sidebar />
            <ToastProvider>
              <div className="flex flex-col flex-grow ">
                <Nav />
                <div className="flex flex-col items-center justify-center">
                  {children}
                </div>
              </div>
            </ToastProvider>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
*/
