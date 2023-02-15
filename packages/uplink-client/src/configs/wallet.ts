import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";

const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! }),
    //publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    return await fetch(
      `${process.env.NEXT_PUBLIC_BASE_HUB_URL}${process.env.NEXT_PUBLIC_AUTH_PATH}/generate_nonce`
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
      `${process.env.NEXT_PUBLIC_BASE_HUB_URL}${process.env.NEXT_PUBLIC_AUTH_PATH}/sign_in`,
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
      `${process.env.NEXT_PUBLIC_BASE_HUB_URL}${process.env.NEXT_PUBLIC_AUTH_PATH}/sign_out`
    );
  },
});


export { authenticationAdapter, wagmiClient, chains };