import { authOptions } from "@/lib/auth";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";

export default async function Page() {
  return <p>hello</p>;
}
