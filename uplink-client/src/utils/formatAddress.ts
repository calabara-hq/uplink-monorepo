export const formatAddress = (address: string): string => {
    return `${address.substring(0, 4)}\u2026${address.substring(address.length - 4)}`
  }
  