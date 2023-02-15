import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import WalletConnectButton from "./components/WalletConnect/WalletConnect";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>app/page.tsx</code>
        </p>
      </div>

      <div className={styles.center}>
      <WalletConnectButton />
      </div>
    </main>
  );
}
