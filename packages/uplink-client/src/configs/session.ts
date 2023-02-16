import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";


export default function initializeAdapter() {
  return createAuthenticationAdapter({
    getNonce: async () => {
      return await fetch(
        `${process.env.NEXT_PUBLIC_HUB_URL}/auth/generate_nonce`
      )
        .then((res) => res.json())
        .then((res) => res.nonce);
    },

    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },

    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },

    verify: async ({ message, signature }) => {
      return await fetch(
        `${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, signature }),
        }
      )
        .then((res) => res.json())
        .then((res) => Boolean(res));
    },

    signOut: async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_out`
      );
    },
  });
}
//export default authenticationAdapter