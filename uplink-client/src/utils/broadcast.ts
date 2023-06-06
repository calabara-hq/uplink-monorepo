import { unixNow } from "./time"

export interface BroadcastMessage {
    event?: "session"
    data?: { trigger?: "signout" | "getSession" }
    clientId: string
    timestamp: number
}


export function BroadcastChannel(name = "nextauth.message") {
    return {
        /** Get notified by other tabs/windows. */
        receive(onReceive: (message: BroadcastMessage) => void) {
            const handler = (event: StorageEvent) => {
                if (event.key !== name) return
                const message: BroadcastMessage = JSON.parse(event.newValue ?? "{}")
                if (message?.event !== "session" || !message?.data) return

                onReceive(message)
            }
            window.addEventListener("storage", handler)
            return () => window.removeEventListener("storage", handler)
        },
        /** Notify other tabs/windows. */
        post(message: Record<string, unknown>) {
            if (typeof window === "undefined") return
            try {
                localStorage.setItem(
                    name,
                    JSON.stringify({ ...message, timestamp: unixNow() })
                )
            } catch {
                /**
                 * The localStorage API isn't always available.
                 * It won't work in private mode prior to Safari 11 for example.
                 * Notifications are simply dropped if an error is encountered.
                 */
            }
        },
    }
}