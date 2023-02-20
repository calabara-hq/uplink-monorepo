import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

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

const formatAddress = (address: string): string => {
  return `${address.substring(0, 4)}\u2026${address.substring(address.length - 4)}`
}

const formatENS = (name: string): string => {
  const parts = name.split('.');
  const last = parts.pop();
  if (parts.join('.').length > 24) {
    return `${parts.join('.').substring(0, 24)}...`;
  }
  return `${parts.join('.')}.${last}`;
}

export { wagmiClient, chains, formatAddress };