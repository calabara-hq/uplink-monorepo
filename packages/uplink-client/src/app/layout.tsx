import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "../providers/WalletProvider";
import { getSession } from "@/providers/SessionProvider";
import { cookies, headers } from "next/headers";
import { fetchData } from "@/utils /fetchData";
import { CtxOrReq } from "next-auth/client/_utils";

// pass cookies from request to the hub api and return a seession object
// this forces the top level layout to become a dynamic route, which may not be ideal
// https://beta.nextjs.org/docs/rendering/static-and-dynamic-rendering#dynamic-rendering

const getInitialSession = async () => {
  const headersInstance = headers();
  const cookies = headersInstance.get("cookie");

  try {
    const session = await fetch(
      `${process.env.NEXT_PUBLIC_HUB_URL}/auth/session`,
      { headers: cookies ? { cookie: cookies } : undefined }
    );
    return session.json();
  } catch (e) {
    console.log("error fetching initial session", e);
  }
  /*
  const req: any = {
    headers: {
      cookie: cookies ? cookies : undefined,
    },
  };
  const session = await fetchData("/auth/session", req);
  return session;
  */
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = null//await getInitialSession();
  console.log("initial session", session);
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
