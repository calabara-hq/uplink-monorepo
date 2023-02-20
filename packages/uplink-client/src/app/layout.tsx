import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "../providers/WalletProvider";
import { getSession } from "@/providers/SessionProvider";
import { cookies, headers } from "next/headers";

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
    console.log("error fetchin initial session", e);
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getInitialSession();
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
