import Nav from "@/ui/Nav/Nav";
import "@/styles/globals.css";
import WalletContext from "./WalletContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head />
      <body className="text">
        <WalletContext session={session}>
          <Nav />
          {children}
        </WalletContext>
      </body>
    </html>
  );
}
