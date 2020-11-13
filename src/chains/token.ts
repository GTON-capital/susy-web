import { assetBalance } from '@waves/waves-transactions/dist/nodeInteraction'
import { AvailableChains, Chain } from './chain'

interface ChainBridgeConfig {
  sourcePort: string
  destinationPort: string
}

export type Token = {
  ticker: string
  label: string
  icon: string
  bg: string
  decimals: number
  assetId: string
  ERC20?: string
  bridgeConfig?: ChainBridgeConfig
}

export const AvailableTokens: Record<string, Token> = {
  SignTestnet: {
    ticker: 'SIGN',
    label: 'SIGN Testnet',
    icon: '/img/icons/signature-chain.svg',
    bg: 'black',
    decimals: 8,
    assetId: 'Gf9t8FA4H3ssoZPCwrg3KwUFCci8zuUFP9ssRsUY3s6a',
  },
  SignStagenet: {
    ticker: 'SIGN',
    label: 'SIGN Stagenet',
    icon: '/img/icons/signature-chain.svg',
    bg: 'black',
    assetId: '6x8nupBUrX3u1VQcL4jFsf9UyyqacUNbVsKB9WHJ61Qm',
    ERC20: '0xc2dda926711eb9b94b89c886aabb8b11d6ac014d',
    decimals: 8,
  },
  SignMainnet: {
    ticker: 'SIGN',
    label: 'SIGN Mainnet',
    icon: '/img/icons/signature-chain.svg',
    bg: 'black',
    assetId: '9sQutD5HnRvjM1uui5cVC4w9xkMPAfYEV8ymug3Mon2Y',
    ERC20: '0x29499dD7da98588077806a9Fd45048692b443A3F',
    decimals: 8,
    bridgeConfig: {
      sourcePort: '3PEDESe94yGyY8X3Gez4u7cyZCa4JTAT6h3',
      destinationPort: '0x9922Ec4054571711ab2bBAcda9B9E40321260ACa'
    }
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
    ERC20: '0x8478f3C11F167da1C7C2c57F5FB3a34B584A4217',
    decimals: 6,
  },
  NSBTMainnet: {
    ticker: 'NSBT',
    label: 'NSBT',
    bg: 'black',
    icon: '/img/icons/tokens/nsbt.svg',
    assetId: '6nSpVyNH7yM69eg446wrQR94ipbbcmZMU1ENPwanC97g',
    ERC20: '0x01B5E6bfaCA9041ab42855e2c7B80dF53378180B',
    decimals: 6,
    bridgeConfig: {
      sourcePort: '3PGaUbcP9qtFcVvW59WXEyU2JvS866pCWNW',
      destinationPort: '0xeF79FdA8cd7Ffc1a9b97320146E3d66404249B23'
    }
  },
  USDNMainnet: {
    ticker: 'USDN',
    label: 'USDN',
    bg: 'black',
    icon: '/img/icons/tokens/usdn.svg',
    assetId: 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
    ERC20: '0xc4b6F32B84657E9f6a73fE119f0967bE5bA8CF05',
    decimals: 6,
    bridgeConfig: {
      sourcePort: '3PFhJUFXAwzPzNMjJkxQYFqEUPr8Jm4BmqP',
      destinationPort: '0x549200f306BB2dC676ef052125Dc499A1e897120'
    }
  },
  //ErgoMainnet: {
  //ticker: 'Ergo',
  //label: 'Ergo',
  //bg: 'black',
  //icon: '/img/icons/ergO.svg',
  //assetId: '6nSpVyNH7yM69eg446wrQR94ipbbcmZMU1ENPwanC97g',
  //ERC20: '0x01B5E6bfaCA9041ab42855e2c7B80dF53378180B',
  //decimals: 6,
  //bridgeConfig: {
  // sourcePort: '3PMMhFMzC86MstkNopJMNJoyUhDVCBxADCe',
  // destinationPort: '0x4B559A1c1Bc2701AAD4267Fc7A86d117e02f06c4'
  //sourcePort: '1fkRdEtioC44Klgqpvn78hq3kbGGpq7fqwg',
  //destinationPort: '5hkqnJJ94vkKg9vhNbwlbf4jblwbn4cmNNd'
  //}
  //},
  //WestMainnet: {
  //ticker: 'West',
  //label: 'West',
  //bg: 'black',
  //icon: '/img/icons/west.svg',
  //assetId: '6nSpVyNH7yM69eg446wrQR94ipbbcmZMU1ENPwanC97g',
  //ERC20: '0x01B5E6bfaCA9041ab42855e2c7B80dF53378180B',
  //decimals: 6,
  //bridgeConfig: {
  // sourcePort: '3PMMhFMzC86MstkNopJMNJoyUhDVCBxADCe',
  // destinationPort: '0x4B559A1c1Bc2701AAD4267Fc7A86d117e02f06c4'
  //sourcePort: '1fkRdEtioC44Klgqpvn78hq3kbGGpq7fqwg',
  //destinationPort: '5hkqnJJ94vkKg9vhNbwlbf4jblwbn4cmNNd'
  //}
  //},
}

export function formLinkForChain(chain: Chain, address: string): string {
  switch (chain.id) {
    case AvailableChains.BSC.id:
      // return `https://testnet.bscscan.com/address/${address}#tokentxns`
      return `https://bscscan.com/address/${address}#tokentxns`
    case AvailableChains.Ethereum.id:
      // return `https://ropsten.etherscan.io/address/${address}#tokentxns`
      return `https://etherscan.io/address/${address}#tokentxns`
    case AvailableChains.Waves.id:
      // return `https://wavesexplorer.com/stagenet/address/${address}`
      return `https://wavesexplorer.com/address/${address}`
  }

  return ''
}

export function getAvailableTokens(): Token[] {
  return [
    // AvailableTokens.SignStagenet,
    // AvailableTokens.WBNBStagenet
    AvailableTokens.USDNMainnet,
    // AvailableTokens.SignMainnet,
    // AvailableTokens.NSBTMainnet,
    //AvailableTokens.ErgoMainnet,
    //AvailableTokens.WestMainnet,
  ]
}
