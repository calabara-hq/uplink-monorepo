import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { SiweMessage } from "siwe";

const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! }),
    publicProvider(),

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

console.log('GOT THE WALLET CONFIG')

export { wagmiClient, chains };