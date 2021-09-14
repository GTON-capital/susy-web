import { Chain } from "~/src/chains/chain"
import { GatewayBridge } from "~/src/chains/token"

export type DirectionChainsCfg = {
  origin: Chain[]
  destination: Chain[]
}

export type ProcessingTransferTxs = {
  inputTx: string | null
  outputTx: string | null
}

export type TokenProcessingTransfer = {
  logo: string
  label: string
  chainLogo: string
  chainLabel: string
}

export type ProcessingTransferProps = {
  amount: number
  bridge: GatewayBridge
  inputLabel: string
  outputLabel: string
  inputTx: string | null
  outputTx: string | null
  inputToken: TokenProcessingTransfer
  outputToken: TokenProcessingTransfer
}

export interface SwapMessage {
  text: string
  linkA?: string
  linkB?: string
}

export const SwapLoaderType = {
  Plain: "plain-loader",
  Transactions: "susy-loader",
}

export const SwapLoaderMessage = {
  Processing: "Transfer is processing",
  Allowance: "Waiting for allowance approval",
}
