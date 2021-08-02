import _ from "lodash"

export type Chain = { id: string; label: string; icon: string }

export type AvailableChainsDict = {
  Ethereum: Chain
  Heco: Chain
  Waves: Chain
  BSC: Chain
  Fantom: Chain
  Avax: Chain
  Polygon: Chain
  Solana: Chain
}

export const SOLANA_CHAIN: string = "7"

export const AvailableChains: AvailableChainsDict = {
  Ethereum: {
    id: "1",
    label: "ETH",
    icon: "/img/icons/ethereum.svg",
  },
  Waves: {
    id: "2",
    label: "WAVES",
    icon: "/img/icons/waves.svg",
  },
  BSC: {
    id: "3",
    label: "BSC",
    icon: "https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png",
  },
  Heco: {
    id: "4",
    label: "HECO",
    icon: "/img/icons/heco.jpg",
  },
  Fantom: {
    id: "5",
    label: "Fantom Opera",
    icon: "/img/icons/fantom.png",
  },
  Avax: {
    id: "6",
    label: "Avax C-Chain",
    icon: "/img/icons/avax.png",
  },
  Solana: {
    id: SOLANA_CHAIN,
    label: "Solana",
    icon: "/img/icons/solana.svg",
  },
  Polygon: {
    id: "8",
    label: "Polygon",
    icon: "/img/icons/polygon.svg",
  },
}

export const availableEVMChains = () => [AvailableChains.Ethereum, AvailableChains.Avax, AvailableChains.BSC, AvailableChains.Heco, AvailableChains.Fantom, AvailableChains.Polygon]

export const isEVMChain = (inputChain: Chain): boolean => {
  return (
    _.intersection(
      availableEVMChains().map((x) => x.id),
      [inputChain.id]
    ).length > 0
  )
}
