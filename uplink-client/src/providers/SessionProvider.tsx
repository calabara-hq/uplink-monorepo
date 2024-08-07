/**
 * Copyright (c) 2022-2023, Balázs Orbán
 * ISC License
 *
 * the following is a modified version of the nextAuth session provider
 *
 **/

"use client";
import { unixNow } from "@/utils/time";
import { createContext, useEffect, useState, useMemo, useContext } from "react";
import { BroadcastChannel } from "@/utils/broadcast";
import { IncomingMessage } from "http";

export type ISODateString = string;

export type UserTwitterObject = {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  profile_image_url_large: string;
};

export interface Session {
  user?: {
    id?: string | null;
    address?: string | null;
    twitter?: UserTwitterObject | null;
    displayName?: string | null;
    userName?: string | null;
    profileAvatar?: string | null
  };
  expires: ISODateString;
  csrfToken: string | null;
}

interface ISessionStore {
  _lastSync: number;
  _session?: Session | null | undefined;
  _getSession: (...args: any[]) => any;
}

interface CtxOrReq {
  req?: IncomingMessage;
  ctx?: { req: IncomingMessage };
}

// context definition

type SessionContextValue<R extends boolean = false> = R extends true
  ?
  | { data: Session; status: "authenticated" }
  | { data: null; status: "loading" }
  :
  | { data: Session; status: "authenticated" }
  | { data: null; status: "unauthenticated" | "loading" };

export const SessionContext = createContext?.<SessionContextValue | undefined>(
  undefined
);

// in-memory client session store

const _SessionStore: ISessionStore = {
  _lastSync: 0,
  _session: undefined,
  _getSession: () => { },
};

// tab / window broadcast channel

const broadcast = BroadcastChannel();

const useOnline = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );

  const setOnline = () => setIsOnline(true);
  const setOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return isOnline;
};

export interface UseSessionOptions<R extends boolean> {
  required: R;
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void;
}

// session context hook

export function useSession<R extends boolean>(options?: UseSessionOptions<R>) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  // @ts-expect-error Satisfy TS if branch on line below
  const value: SessionContextValue<R> = useContext(SessionContext);
  if (!value && process.env.NODE_ENV !== "production") {
    throw new Error("`useSession` must be wrapped in a <SessionProvider />");
  }

  const { required, onUnauthenticated } = options ?? {};

  const requiredAndNotLoading = required && value.status === "unauthenticated";

  useEffect(() => {
    if (requiredAndNotLoading) {
      const url = `${process.env.NEXT_PUBLIC_HUB_URL
        }/auth/signin?${new URLSearchParams({
          error: "SessionRequired",
          callbackUrl: window.location.href,
        })}`;
      if (onUnauthenticated) onUnauthenticated();
      else window.location.href = url;
    }
  }, [requiredAndNotLoading, onUnauthenticated]);

  if (requiredAndNotLoading) {
    return { data: value.data, status: "loading" } as const;
  }

  return value;
}

export type GetSessionParams = CtxOrReq & {
  event?: "storage" | "timer" | "hidden" | string;
  triggerEvent?: boolean;
  broadcast?: boolean;
};

// fetch the current session from the server

export const getSession = async (params?: GetSessionParams) => {
  const session = await fetch(
    `${process.env.NEXT_PUBLIC_HUB_URL}/auth/session`,
    {
      credentials: "include",
      cache: "no-store",
    }
  )
    .then((res) => res.json())
    .then((data) => (Object.keys(data).length > 0 ? data : null))
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (params?.broadcast ?? true) {
    broadcast.post({ event: "session", data: { trigger: "getSession" } });
  }
  return session;
};

// fetch a csrf from the server

export const getCsrfToken = async (params?: CtxOrReq) => {
  return await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/csrf`, {
    credentials: "include",
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((data) => data.csrfToken)
    .catch((err) => console.log(err));
};

export type SignInParams = {
  message: string;
  signature: string;
};

// attempt to sign in with the message + signature

export const signIn = async (credentials: SignInParams) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...credentials,
    }),
    cache: "no-store",
  });
  const data = await res.json();
  if (res.ok) await _SessionStore._getSession({ event: "storage" });
  return {
    status: res.status,
    ok: res.ok,
  } as any;
};

// sign out

export const signOut = async () => {
  const csrfToken = _SessionStore._session?.csrfToken;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HUB_URL}/auth/sign_out`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ csrfToken }),
    }
  );
  const data = await response.json();
  await _SessionStore._getSession({ event: "storage" });
  return data;
};

export const twitterSignIn = async (scopeType: string) => {
  // Logic to sign in with Twitter goes here
  const csrfToken = _SessionStore._session?.csrfToken;
  return await fetch(
    `${process.env.NEXT_PUBLIC_HUB_URL}/auth/twitter/initiate_twitter_auth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ scopeType, csrfToken }),
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    });
};

type SessionProviderProps = {
  children: React.ReactNode;
  session: Session | null;
  refetchInterval?: number;
  refetchWhenOffline?: boolean;
  refetchOnWindowFocus?: boolean;
};

export function SessionProvider(props: SessionProviderProps) {
  const { children, refetchInterval, refetchWhenOffline } = props;

  const hasInitialSession = props.session !== undefined;
  _SessionStore._lastSync = hasInitialSession ? unixNow() : 0;

  // TODO refine any type here
  const [session, setSession] = useState<any>(() => {
    if (hasInitialSession) _SessionStore._session = props.session;
    return props.session;
  });
  // if session is passed, init as not loading

  const [loading, setLoading] = useState<boolean>(!hasInitialSession);

  // on initial mount
  useEffect(() => {
    _SessionStore._getSession = async ({ event } = {}) => {
      try {
        const storageEvent = event === "storage";

        // update if client session not present or if there are events from other tabs

        if (storageEvent || _SessionStore._session === undefined) {
          _SessionStore._lastSync = unixNow();
          _SessionStore._session = await getSession({
            broadcast: !storageEvent,
          });

          setSession(_SessionStore._session);
          return;
        }
        // If there is no time defined for when a session should be considered
        // stale, then it's okay to use the value we have until an event is
        // triggered which updates it
        // If the client doesn't have a session then we don't need to call
        // the server to check if it does (if they have signed in via another
        // tab or window that will come through as a "storage" event
        // event anyway)
        // Bail out early if the client session is not stale yet
        if (
          !event ||
          _SessionStore._session === null ||
          unixNow() < _SessionStore._lastSync
        )
          return;

        // en event was triggered or the session is stale, so we need to update the session

        _SessionStore._lastSync = unixNow();
        _SessionStore._session = await getSession();

        setSession(_SessionStore._session);
      } catch (error) {
        console.error("client session error", error);
      } finally {
        setLoading(false);
      }
    };

    _SessionStore._getSession();

    // cleanup

    return () => {
      _SessionStore._lastSync = 0;
      _SessionStore._session = undefined;
      _SessionStore._getSession = () => { };
    };
  }, []);

  useEffect(() => {
    // Listen for storage events and update session if event fired from
    // another window (but suppress firing another event to avoid a loop)
    // Fetch new session data but tell it to not to fire another event to
    // avoid an infinite loop.
    // Note: We could pass session data through and do something like
    // `setData(message.data)` but that can cause problems depending
    // on how the session object is being used in the client; it is
    // more robust to have each window/tab fetch it's own copy of the
    // session object rather than share it across instances.
    const unsubscribe = broadcast.receive(() =>
      _SessionStore._getSession({ event: "storage" })
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const { refetchOnWindowFocus = true } = props;
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session, but only if
    // this feature is not disabled.
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === "visible") {
        _SessionStore._getSession({ event: "visibilitychange" });
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler, false);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        visibilityHandler,
        false
      );
  }, [props.refetchOnWindowFocus]);

  const isOnline = useOnline();
  const shouldRefetch = refetchWhenOffline !== false || isOnline;

  useEffect(() => {
    if (refetchInterval && shouldRefetch) {
      const refetchIntervalTimer = setInterval(() => {
        if (_SessionStore._session) {
          _SessionStore._getSession({ event: "poll" });
        }
      }, refetchInterval * 1000);
      return () => {
        clearInterval(refetchIntervalTimer);
      };
    }
  }, [refetchInterval, shouldRefetch]);

  const value: any = useMemo(
    () => ({
      data: session,
      status: loading
        ? "loading"
        : session
          ? "authenticated"
          : "unauthenticated",
    }),
    [session, loading]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
