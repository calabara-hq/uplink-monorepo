import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import { headers } from "next/headers";
import { fetchData } from "@/utils /fetchData";
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
  console.log("layout re-render");

  return (
    <html lang="en">
      <head />
      <body>
        <WalletProvider session={session}>
          <Nav />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
