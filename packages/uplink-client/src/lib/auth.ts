
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import TwitterProvider from "next-auth/providers/twitter"
import { getCsrfToken, getProviders, signIn } from "next-auth/react"
import { SiweMessage, generateNonce } from "siwe"

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 30 * 60,
    },
    jwt: {
        /*
        async encode({ secret, token, maxAge }) {
            console.log('secret is', secret)
            console.log('token is', token)
            return jwt.sign(token, secret)
        }
        */
    },


    providers: [

        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0",
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0",
                },
            },
            async authorize(credentials) {

                const res = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_in`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials)
                })
                const user = await res.json()
                if (res.ok && user) {
                    return user
                }
                /*
                try {
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,

                    })

                    if (result.success) {
                        return {
                            id: siwe.address,
                        }
                    }
                    return null
                } catch (e) {
                    console.log(e)
                    return null
                }
                */

            }
        }),
    ],



    callbacks: {

        async signIn({ user, account, profile, email, credentials }) {
            /*
            account && (account.type == 'Twitter') {
                user.
            }
            */
            return true
        },
        async jwt({ token, user }) {
            user && (token.user = user)
            console.log("TOKEN IS", token, "\n\n")
            console.log("USER IS", user, "\n\n")
            return token
        },


        async session({ session, token }: { session: any; token: any }) {
            session.address = token.user.address
            console.log(session)
            return session
        },
    }
}


/*
const res = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credentials: credentials })
})

const data = await res.json()
if (data.ok && data.user) {
    return data.user
}
*/
