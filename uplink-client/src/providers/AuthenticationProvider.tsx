import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { useMemo } from "react";
import { useSession, signIn, signOut, getCsrfToken } from "./SessionProvider";

type UnconfigurableMessageOptions = {
  address: string;
  chainId: number;
  nonce: string;
};

interface SiweMessage {
  nonce: string;
  address: string;
  domain: string;
  version: string;
  chainId: number;
  uri: string;
  issuedAt: string;
  statement: string;
}

type ConfigurableMessageOptions = Partial<
  Omit<SiweMessage, keyof UnconfigurableMessageOptions>
> & {
  [Key in keyof UnconfigurableMessageOptions]?: never;
};

export type GetSiweMessageOptions = () => ConfigurableMessageOptions;

interface RainbowKitSiweNextAuthProviderProps {
  enabled?: boolean;
  getSiweMessageOptions?: GetSiweMessageOptions;
  children: React.ReactNode;
}

const prepareMessage = (message: SiweMessage) => {
  const header = `${message.domain} wants you to sign in with your Ethereum account:`;
  const uriField = `URI: ${message.uri}`;
  let prefix = [header, message.address].join("\n");
  const versionField = `Version: ${message.version}`;
  const chainField = `Chain ID: ` + message.chainId || "1";
  const nonceField = `Nonce: ${message.nonce}`;
  const suffixArray = [uriField, versionField, chainField, nonceField];
  suffixArray.push(`Issued At: ${message.issuedAt}`);
  const statement = message.statement;
  const suffix = suffixArray.join("\n");
  prefix = [prefix, statement].join("\n\n");
  return [(prefix += "\n"), suffix].join("\n");
};

export function AuthenticationProvider({
  children,
  enabled,
  getSiweMessageOptions,
}: RainbowKitSiweNextAuthProviderProps) {
  const { data, status } = useSession();
  const adapter = useMemo(
    () =>
      createAuthenticationAdapter({
        createMessage: ({ address, chainId, nonce }) => {
          const defaultConfigurableOptions: ConfigurableMessageOptions = {
            statement: "sign here please!",
            domain: process.env.NEXT_PUBLIC_HUB_URL,
            uri: window.location.origin,
            version: "1",
          };

          const unconfigurableOptions: UnconfigurableMessageOptions = {
            address,
            chainId,
            nonce,
          };

          return {
            ...defaultConfigurableOptions,
            ...getSiweMessageOptions?.(),
            ...unconfigurableOptions,
            issuedAt: new Date().toISOString(),
          };
        },

        getMessageBody: ({ message }: { message: SiweMessage }) => {
          return prepareMessage(message);
        },

        getNonce: async () => {
          const csrf = await getCsrfToken();
          if (!csrf) throw new Error();
          return csrf;
        },

        signOut: async () => {
          await signOut();
        },

        verify: async ({ message, signature }) => {
          const response: any = await signIn({
            message: JSON.stringify(message),
            signature,
          });
          return response?.ok ?? false;
        },
      }),
    [getSiweMessageOptions]
  );

  return (
    <RainbowKitAuthenticationProvider adapter={adapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
}
