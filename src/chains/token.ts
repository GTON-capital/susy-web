import { AvailableChains, Chain } from './chain'

export type Token = {
  ticker: string
  label: string
  icon: string
  bg: string
  decimals: number
  assetId: string
  ERC20?: string
}

export const AvailableTokens: Record<string, Token> = {
  SignTestnet: {
    ticker: 'SIGN',
    label: 'SIGN Testnet',
    icon: '/img/icons/signature-chain.png',
    bg: 'black',
    decimals: 8,
    assetId: 'Gf9t8FA4H3ssoZPCwrg3KwUFCci8zuUFP9ssRsUY3s6a',
  },
  SignStagenet: {
    ticker: 'SIGN',
    label: 'SIGN Stagenet',
    icon: '/img/icons/signature-chain.png',
    bg: 'black',
    assetId: '6x8nupBUrX3u1VQcL4jFsf9UyyqacUNbVsKB9WHJ61Qm',
    ERC20: '0xc2dda926711eb9b94b89c886aabb8b11d6ac014d',
    decimals: 8,
  },
  SusyStagenet: {
    ticker: 'SIGN',
    label: 'SuSy token Stagenet',
    icon: '/img/icons/waves.svg',
    bg: 'black',
    assetId: 'Ftnm2XbEWTF54z84UHg7LwPcuBZicXEgvhUdmFt84EWH',
    decimals: 8,
  },
  WBNBStagenet: {
    ticker: 'WBNB',
    label: 'WBNB Stagenet',
    icon: 'https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png',
    bg: 'black',
    assetId: 'Ap4heStRGQbHAxR6qb9UFtJ3kBiGuumdnsd9JzTHwTTL',
    // ERC20: '0xb834BBbE424Ca134b372e7D275Ef628CDCB4F65E',
    ERC20: '0xe1DB0FF90B539518ed4F3Ef8e3Dcc7f60726b457',
    decimals: 6,
  },
}

export function formLinkForChain(chain: Chain, address: string): string {
  switch (chain.id) {
    case AvailableChains.BSC.id:
      return `https://testnet.bscscan.com/address/${address}#tokentxns`
    case AvailableChains.Ethereum.id:
      return `https://ropsten.etherscan.io/address/${address}#tokentxns`
    case AvailableChains.Waves.id:
      return `https://wavesexplorer.com/stagenet/address/${address}`
  }

  return ''
}

export function getAvailableTokens(): Token[] {
  return [AvailableTokens.SignStagenet, AvailableTokens.WBNBStagenet]
}
