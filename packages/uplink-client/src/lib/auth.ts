
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage, generateNonce } from "siwe"


export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 30 * 60,
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
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_in`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    });
                    const user = await res.json();
                    if (res.ok && user) {
                        console.log(user)
                        return user.data.address;
                    }
                    else {
                        return null;
                    }
                } catch (e) {
                    console.log(e);
                    return null
                }
                /*
                try {
                    console.log(credentials)
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        //nonce: generateNonce(),
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
        })
    ],
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (token) {
                console.log(token.sub)
                session.address = token.sub
                session.user.name = token.sub
                session.user.image = "https://www.fillmurray.com/128/128"
            }
            return session
        },

    }
}
