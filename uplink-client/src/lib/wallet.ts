import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
    publicProvider()]
)

const { wallets } = getDefaultWallets({
  appName: 'Uplink.wtf',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains,
});

const appInfo = {
  appName: 'Uplink.wtf'
}

const connectors = connectorsForWallets([
  ...wallets,
]);

const wagmiConfig = createConfig({
  connectors,
  autoConnect: true,
  publicClient,
  webSocketPublicClient
})

export { wagmiConfig, appInfo, chains };