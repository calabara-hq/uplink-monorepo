import Header from "@/components/Header";
import "@/styles/globals.css";
import Nav from "./nav";
import WalletContext from "./WalletContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("im running");

// 1. fetch the auth state and revalidate every 60 seconds
const getAuthState = () => {};

// 2. pass the auth state to the custom auth adapter

// 3. use the adapter to sign in

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log("SESSION FROM LAYOUT IS", session);
  return (
    <html lang="en">
      <head />
      <body className="text">
        <WalletContext session={session}>
          <Header />
          {children}
        </WalletContext>
      </body>
    </html>
  );
}
