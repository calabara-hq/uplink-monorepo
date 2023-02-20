import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { useMemo } from "react";
import { useSession, signIn, signOut, getCsrfToken } from "./SessionProvider";

type UnconfigurableMessageOptions = {
  address: string;
  chainId: number;
  nonce: string;
};

type ConfigurableMessageOptions = Partial<
  Omit<SiweMessage, keyof UnconfigurableMessageOptions>
> &
  {
    [Key in keyof UnconfigurableMessageOptions]?: never;
  };

export type GetSiweMessageOptions = () => ConfigurableMessageOptions;

interface RainbowKitSiweNextAuthProviderProps {
  enabled?: boolean;
  getSiweMessageOptions?: GetSiweMessageOptions;
  children: React.ReactNode;
}

export function AuthenticationProvider({
  children,
  enabled,
  getSiweMessageOptions,
}: RainbowKitSiweNextAuthProviderProps) {
  const { data, status } = useSession();
  console.log(status);
  console.log(data);
  const adapter = useMemo(
    () =>
      createAuthenticationAdapter({
        createMessage: ({ address, chainId, nonce }) => {
          console.log("CREATING THE MESSAGE!!!");
          const defaultConfigurableOptions: ConfigurableMessageOptions = {
            domain: window.location.host,
            statement: "Sign in with Ethereum to the app.",
            uri: window.location.origin,
            version: "1",
          };

          const unconfigurableOptions: UnconfigurableMessageOptions = {
            address,
            chainId,
            nonce,
          };

          const msg = new SiweMessage({
            ...defaultConfigurableOptions,
            ...getSiweMessageOptions?.(),
            ...unconfigurableOptions,
          });

          console.log(msg);
          return msg;
        },

        getMessageBody: ({ message }) => message.prepareMessage(),

        getNonce: async () => {
          const nonce = await getCsrfToken();
          if (!nonce) throw new Error();
          console.log(nonce);
          return nonce;
        },

        signOut: async () => {
          await signOut();
        },

        verify: async ({ message, signature }) => {
          const response: any = await signIn({
            message: JSON.stringify(message),
            signature,
          });
          console.log(response);
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
