import { authOptions } from "@/lib/auth"
import { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"


export default async function Page() {
 // const session = await getServerSession(authOptions)
  //console.log('SESSION HERE', session)
  //return <pre>{JSON.stringify(session, null, 2)}</pre>
  return <p>hello</p>
}