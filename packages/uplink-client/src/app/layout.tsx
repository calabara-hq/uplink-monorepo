import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import { headers } from "next/headers";
import { fetchData } from "@/utils /fetchData";

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
  console.log("layout re-render");

  return (
    <html lang="en">
      <head />
      <body className="bg-base min-h-screen">
        <WalletProvider session={session}>
          <Nav />
          {/*<Sidebar />*/}
          <ToastProvider>
            <main className="">{children}</main>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );

  return;
}
