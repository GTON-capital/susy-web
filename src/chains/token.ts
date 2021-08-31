import { AvailableChains, Chain } from "./chain"

type BridgeTokenCfg = {
  assetId: string
  decimals: number
}

export interface ChainBridgeConfig {
  meta?: Record<string, any>
  token: {
    origin: BridgeTokenCfg
    dest: BridgeTokenCfg
  }
  sourcePort: string
  destinationPort: string
}

export type Token = {
  ticker: string
  label: string
  labelWrapped?: string
  icon: string
  iconWrapped?: string
  bg: string
  // decimals: number
  // assetId: string
  ERC20?: string
  bridge?: GatewayBridge[]
}

export class GatewayBridge {
  origin: Chain
  destination: Chain
  cfg: ChainBridgeConfig

  constructor({ origin, destination, cfg }: { origin: Chain; destination: Chain; cfg: ChainBridgeConfig }) {
    this.origin = origin
    this.destination = destination
    this.cfg = cfg
  }
}

export const availableOriginChains = (bridge?: GatewayBridge[]) => {
  return (
    bridge?.reduce((acc: Chain[], current: GatewayBridge) => {
      const existing = acc.map((x) => x.id)

      if (!existing.includes(current.origin.id)) {
        return [...acc, current.origin]
      }

      return acc
    }, []) ?? []
  )
}
export const availableDestChains = (bridge?: GatewayBridge[]) => {
  return bridge?.map((x: GatewayBridge) => x.destination) ?? []
}
export const pickBridgeGateway = (bridgeList: GatewayBridge[], origin: Chain, dest: Chain): GatewayBridge | null => {
  for (const bridge of bridgeList) {
    if (bridge.destination.id === dest.id && bridge.origin.id === origin.id) {
      return bridge
    }
  }

  return null
}

export const AvailableTokens: Record<string, Token> = {
  // SignTestnet: {
  //   ticker: 'SIGN',
  //   label: 'SIGN Testnet',
  //   icon: '/img/icons/signature-chain.svg',
  //   bg: 'black',
  //   // decimals: 8,
  //   assetId: 'Gf9t8FA4H3ssoZPCwrg3KwUFCci8zuUFP9ssRsUY3s6a',
  // },
  // SignStagenet: {
  //   ticker: 'SIGN',
  //   label: 'SIGN Stagenet',
  //   icon: '/img/icons/signature-chain.svg',
  //   bg: 'black',
  //   assetId: '6x8nupBUrX3u1VQcL4jFsf9UyyqacUNbVsKB9WHJ61Qm',
  //   ERC20: '0xc2dda926711eb9b94b89c886aabb8b11d6ac014d',
  //   decimals: 8,
  // },
  // SignMainnet: {
  //   ticker: 'SIGN',
  //   label: 'SIGN Mainnet',
  //   icon: '/img/icons/signature-chain.svg',
  //   bg: 'black',
  //   assetId: '9sQutD5HnRvjM1uui5cVC4w9xkMPAfYEV8ymug3Mon2Y',
  //   ERC20: '0x29499dD7da98588077806a9Fd45048692b443A3F',
  //   decimals: 8,
  // },
  // SusyStagenet: {
  //   ticker: 'SIGN',
  //   label: 'SuSy token Stagenet',
  //   icon: '/img/icons/waves.svg',
  //   bg: 'black',
  //   assetId: 'Ftnm2XbEWTF54z84UHg7LwPcuBZicXEgvhUdmFt84EWH',
  //   decimals: 8,
  // },
  // WBNBStagenet: {
  //   ticker: 'WBNB',
  //   label: 'WBNB Stagenet',
  //   icon: 'https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png',
  //   bg: 'black',
  //   assetId: 'Ap4heStRGQbHAxR6qb9UFtJ3kBiGuumdnsd9JzTHwTTL',
  //   ERC20: '0x8478f3C11F167da1C7C2c57F5FB3a34B584A4217',
  //   decimals: 6,
  // },
  NSBTLegacyMainnet: {
    ticker: "NSBT",
    label: "NSBT (LEGACY)",
    bg: "black",
    icon: "/img/icons/tokens/nsbt.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.BSC,
        cfg: {
          token: {
            origin: {
              decimals: 6,
              assetId: "6nSpVyNH7yM69eg446wrQR94ipbbcmZMU1ENPwanC97g",
            },
            dest: {
              decimals: 18,
              assetId: "0x496d451dDAB0F79346f773CbC2eb7Aee58446019",
            },
          },
          sourcePort: "3PPUsj1yjMMAAg2hihdebK7n8zkAagHqdNT",
          destinationPort: "0x59622815BADB181a2c37052136a9480C6A4a4eA6",
        },
      }),
    ],
  },
  gwaNSBTMainnet: {
    ticker: "gwaNSBT",
    label: "gwaNSBT",
    bg: "black",
    icon: "/img/icons/tokens/nsbt.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.BSC,
        cfg: {
          token: {
            origin: {
              decimals: 6,
              assetId: "6nSpVyNH7yM69eg446wrQR94ipbbcmZMU1ENPwanC97g",
            },
            dest: {
              decimals: 18,
              assetId: "0xaDb688CC2D5A729d7e5ddEcDA8B63ED118F41eA4",
            },
          },
          sourcePort: "3PRGPGtsVZVUCFRsEKp1FHccv6uFu8YNqb1",
          destinationPort: "0xf427525Eb648d14c1Da28E530e9fe7ab9832c411",
        },
      }),
    ],
  },
  SWOPMainnet: {
    ticker: "SWOP",
    label: "SWOP Token",
    bg: "black",
    icon: "/img/icons/tokens/swop.png",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.BSC,
        cfg: {
          token: {
            origin: {
              decimals: 8,
              assetId: "Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT",
            },
            dest: {
              decimals: 18,
              assetId: "0x14B819B057078BbD87C5e5f65d54818f490701Ce",
            },
          },
          sourcePort: "3P3Fb6UCW3TB7TGK2BWsV6YfmoL3Y8bv1Km",
          destinationPort: "0xd6C8D0d800B9CbbAE0B13f6d41087bA3CCe797E6",
        },
      }),
    ],
  },
  SIGNMainnet: {
    ticker: "SIGN",
    label: "SIGN Token",
    bg: "black",
    icon: "/img/icons/signature-chain.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.BSC,
        cfg: {
          token: {
            origin: {
              decimals: 8,
              assetId: "9sQutD5HnRvjM1uui5cVC4w9xkMPAfYEV8ymug3Mon2Y",
            },
            dest: {
              decimals: 18,
              assetId: "0xb5e094AEC0D8f019497Bce712AF685aC15BD8c35",
            },
          },
          sourcePort: "3PKKYSedPuFuExJCweD52mj1MtjJLT8da9g",
          destinationPort: "0x072232c6B713024e04D596bf68f1B22AC123af7f",
        },
      }),
    ],
  },
  RAYMainnet: {
    ticker: "RAY",
    label: "RAY",
    labelWrapped: "suRAY",
    bg: "black",
    icon: "/img/icons/tokens/RAY.svg",
    iconWrapped: "/img/icons/tokens/su_RAY.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Solana,
        destination: AvailableChains.BSC,
        cfg: {
          meta: {
            PORT_PROGRAM_ID: "DSZqp3Q3ydt5HeFeX1PfZJWAK8Re7ZoitK3eoot2aRyY",
            PORT_PROGRAM_PDA: "8drhoQ7iAYD9DLY5RBxtQ8BS9vWRMF4nkGG1bnsED9su",
            PORT_DATA_ACCOUNT: "CAGB99utwtaC5XbfeECB1JE2VsTXvw3bYpu57jzYEN8S",
            PORT_TOKEN_ACCOUNT: "GcnLCDRvDqWWq3CoERdTGSkwMU2cRonC6is4sxM7qbHq",
            TOKEN_DATA_ACCOUNT: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
            TOKEN_OWNER: "7nJGERf1LZpjn4uTfcDZLJ6YRtvdSExAB9uK851zT6do",
          },
          token: {
            origin: {
              decimals: 6,
              assetId: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
            },
            dest: {
              decimals: 18,
              assetId: "0x5f3d7468f012039d583461c81393476d785fb094",
            },
          },
          sourcePort: "CAGB99utwtaC5XbfeECB1JE2VsTXvw3bYpu57jzYEN8S",
          destinationPort: "0xA3E9c5f57460c056dE97f14247517FA8e2A55F02",
        },
      }),
    ],
  },
  SRMMainnet: {
    ticker: "SRM",
    label: "SRM",
    labelWrapped: "suSRM",
    bg: "black",
    icon: "/img/icons/tokens/SRM.svg",
    iconWrapped: "/img/icons/tokens/su_SRM.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Solana,
        destination: AvailableChains.BSC,
        cfg: {
          meta: {
            PORT_PROGRAM_ID: "AH3QKaj942UUxDjaRaGh7hvdadsD8yfU9LRTa9KXfJkZ",
            PORT_PROGRAM_PDA: "CYEnZhJdYaUjgFtGQ2FgXe4vp4zMiqY8RsdqwNFduxdm",
            PORT_DATA_ACCOUNT: "BxqxLqfdSXDhrTGdC23CtCmtDb4hyTUxzonqbaenY3up",
            TOKEN_DATA_ACCOUNT: "C3epWMqKx8Bnr9zq93m3r8zy1kogmvHp7i97q9dVPgJh",
            TOKEN_OWNER: "2ANEXknub11fKbmELve361E7rbPFCsu3qEey7oai2Et9",
          },
          token: {
            origin: {
              decimals: 18,
              assetId: "0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d",
            },
            dest: {
              decimals: 8,
              assetId: "C3epWMqKx8Bnr9zq93m3r8zy1kogmvHp7i97q9dVPgJh",
            },
          },
          sourcePort: "0x43874993ecbEf0b78d474471CB012C65247F0b3A",
          destinationPort: "BxqxLqfdSXDhrTGdC23CtCmtDb4hyTUxzonqbaenY3up",
        },
      }),
    ],
  },
  GTONMainnet: {
    ticker: "GTON",
    label: "GTON",
    labelWrapped: "suGTON",
    bg: "black",
    icon: "/img/icons/tokens/GTON.svg",
    iconWrapped: "/img/icons/tokens/su_GTON.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Ethereum,
        destination: AvailableChains.Solana,
        cfg: {
          meta: {
            IBPORT_PROGRAM_ID: "AH3QKaj942UUxDjaRaGh7hvdadsD8yfU9LRTa9KXfJkZ",
            IBPORT_PROGRAM_PDA: "CYEnZhJdYaUjgFtGQ2FgXe4vp4zMiqY8RsdqwNFduxdm",
            IBPORT_DATA_ACCOUNT: "BxqxLqfdSXDhrTGdC23CtCmtDb4hyTUxzonqbaenY3up",
            TOKEN_DATA_ACCOUNT: "C3epWMqKx8Bnr9zq93m3r8zy1kogmvHp7i97q9dVPgJh",
            TOKEN_OWNER: "2ANEXknub11fKbmELve361E7rbPFCsu3qEey7oai2Et9",
          },
          token: {
            origin: {
              decimals: 18,
              assetId: "0x01e0e2e61f554ecaaec0cc933e739ad90f24a86d",
            },
            dest: {
              decimals: 8,
              assetId: "C3epWMqKx8Bnr9zq93m3r8zy1kogmvHp7i97q9dVPgJh",
            },
          },
          sourcePort: "0x43874993ecbEf0b78d474471CB012C65247F0b3A",
          destinationPort: "BxqxLqfdSXDhrTGdC23CtCmtDb4hyTUxzonqbaenY3up",
        },
      }),
    ],
  },
  USDNMainnet: {
    ticker: "USDN",
    label: "USDN",
    bg: "black",
    icon: "/img/icons/tokens/usdn.svg",
    bridge: [
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.BSC,
        cfg: {
          token: {
            origin: {
              decimals: 6,
              assetId: "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p",
            },
            dest: {
              decimals: 18,
              assetId: "0xc4b6F32B84657E9f6a73fE119f0967bE5bA8CF05",
            },
          },
          sourcePort: "3PEXiW1BrBNMo5A9dfj2CnBW2mwMiaf2sAe",
          destinationPort: "0x8c0e11a6E692d02f71598AB5050083ED691Eb760",
        },
      }),
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.Heco,
        cfg: {
          token: {
            origin: {
              decimals: 6,
              assetId: "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p",
            },
            dest: {
              decimals: 18,
              assetId: "0xa10C9B112504bdDBB8dA13ad90f26E6D379dD0e2",
            },
          },
          sourcePort: "3P5ASZYdgDgB6uLKaeVxZmcf71gFhwzDvH2",
          destinationPort: "0x4d43E4ed92469F38839ea2077db7649BC7c175ef",
        },
      }),
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.Fantom,
        cfg: {
          token: {
            origin: {
              decimals: 6,
              assetId: "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p",
            },
            dest: {
              decimals: 18,
              assetId: "0x1d82150c392b2fbaa84b7cb1a471b2be68befcdb",
            },
          },
          sourcePort: "3PPJ2HnXKjuaTopung1K2DsrgMigpwXHsFF",
          destinationPort: "0x83d97d01db4ae12CB637e0732BbB3569d0D218e9",
        },
      }),
      new GatewayBridge({
        origin: AvailableChains.Waves,
        destination: AvailableChains.Avax,
        cfg: {
          token: {
            origin: {
              decimals: 6,
              assetId: "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p",
            },
            dest: {
              decimals: 18,
              assetId: "0x24e29ce9149B2cfC92e49aDc42A816e694aFf1b7",
            },
          },
          sourcePort: "3PDdegFA8R2jUAZHpppcyAdQJ5BFsSMx4Pm",
          destinationPort: "0x9a7B1800CE35aAca97d7Aa06d82F61cb971E947c",
        },
      }),
    ],
  },
}

export function formLinkForChain(chain: Chain, address: string): string {
  switch (chain.id) {
    case AvailableChains.BSC.id:
      return `https://bscscan.com/address/${address}#tokentxns`
    case AvailableChains.Avax.id:
      return `https://cchain.explorer.avax.network/address/${address}#tokentxns`
    case AvailableChains.Ethereum.id:
      return `https://etherscan.io/address/${address}#tokentxns`
    case AvailableChains.Waves.id:
      return `https://wavesexplorer.com/address/${address}`
    case AvailableChains.Heco.id:
      return `https://hecoinfo.com/address/${address}#tokentxns`
    case AvailableChains.Fantom.id:
      return `https://ftmscan.com/address/${address}#tokentxns`
    case AvailableChains.Solana.id:
      return `https://explorer.solana.com/address/${address}/tokens`
  }

  return ""
}

export function getAvailableTokens(): Token[] {
  return (
    [AvailableTokens.GTONMainnet, AvailableTokens.USDNMainnet, AvailableTokens.gwaNSBTMainnet, AvailableTokens.SWOPMainnet, AvailableTokens.SIGNMainnet, AvailableTokens.NSBTLegacyMainnet]
      // UI requires visible tokens to represent bridge config
      .filter((x) => (x.bridge ?? []).length > 0)
  )
}
