import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletProvider from "../providers/WalletProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSession } from "@/providers/SessionProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  //console.log("SESSION FROM LAYOUT", session);
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
