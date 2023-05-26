"use client";
import { Provider } from "urql";
import graphqlClient from "@/lib/graphql/initUrql";
export default function GraphqlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider value={graphqlClient}>{children}</Provider>;
}
