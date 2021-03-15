export type Chain = { id: string; label: string; icon: string }
export type AvailableChainsDict = {
  Ethereum: Chain
  Heco: Chain
  Waves: Chain
  BSC: Chain
  Fantom: Chain
}

export const AvailableChains: AvailableChainsDict = {
  Ethereum: {
    id: '1',
    label: 'ETH Ropsten',
    icon: '/img/icons/ethereum.svg',
  },
  Waves: {
    id: '2',
    label: 'WAVES',
    icon: '/img/icons/waves.svg',
  },
  BSC: {
    id: '3',
    label: 'BSC',
    icon: 'https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png',
  },
  Heco: {
    id: '4',
    label: 'HECO',
    icon: '/img/icons/heco.jpg',
  },
  Fantom: {
    id: '5',
    label: 'Fantom Opera',
    icon: '/img/icons/fantom.png',
  },
}
