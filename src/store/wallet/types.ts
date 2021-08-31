import { WalletAdapter } from "~/services/wallet-adapters"
import { Ports } from "~/services/solana/instruction"

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
  // getWalletAdapter?: () => WalletAdapter
  walletAdapter?: WalletAdapter
  checked?: boolean
  // instructionBuilder?: IBPort.InstructionBuilder
  invoker?: Ports.Invoker
}

export type Wallets = {
  [key: string]: ExtensionWallet
  metamask: ExtensionWallet
  keeper: ExtensionWallet
}

export enum WalletProvider {
  Metamask = "metamask",
  WavesKeeper = "keeper",
  MathWallet = "mathwallet",
  Phantom = "phantom",
}

export type WalletState = Wallets

export const walletSupportsSolana = (provider: WalletProvider): boolean => {
  // return [WalletProvider.MathWallet, WalletProvider.Phantom].includes(provider)
  return [WalletProvider.Phantom].includes(provider)
}
