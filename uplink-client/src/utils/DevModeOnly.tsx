export const DevModeOnly = ({ children }: { children: React.ReactNode }) => {
    if (
        process.env.NEXT_PUBLIC_CLIENT_URL.startsWith('http://localhost')
        ||
        process.env.NEXT_PUBLIC_CLIENT_URL === 'https://staging.uplink.wtf'
    ) {
        return children
    }

    return null
}