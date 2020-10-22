export interface ExtensionWallet {
  wallet: {
    id: string
    label: string
    icon: string
  }
  provider: string
  isConnected: boolean
  label: string
  value?: string
  checked?: boolean
}

export type Wallets = {
  [key: string]: ExtensionWallet
  metamask: ExtensionWallet
  keeper: ExtensionWallet
}

export enum WalletProvider {
  Metamask = 'metamask',
  WavesKeeper = 'keeper',
}

export type WalletState = Wallets