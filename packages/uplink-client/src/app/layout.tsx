import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "../providers/WalletProvider";
import { headers } from "next/headers";
import { fetchData } from "@/utils /fetchData";
import Sidebar from "@/ui/SideBar/SideBar";

// pass cookies from request to the hub api and return a seession object
// this forces the top level layout to become a dynamic route, which may not be ideal
// https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#dynamic-rendering

const getInitialSession = async () => {
  const headersInstance = headers();
  const cookie = headersInstance.get("cookie");
  const session = await fetchData("/auth/session", cookie);
  return session;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInitialSession();
  return (
    <html lang="en">
      <head />
      <body className="bg-[#202225]">
        <WalletProvider session={session}>
          <div className="flex flex-row h-full">
            <Sidebar />
            <div className="flex-1">
              <Nav />
              {children}
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
