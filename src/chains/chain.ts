

export type Chain = { id: string; label: string; icon: string }
export type AvailableChainsDict = { Ethereum: Chain; Waves: Chain; BSC: Chain }

export const AvailableChains: AvailableChainsDict = {
  Ethereum: {
    id: '1',
    label: 'ETH Ropsten',
    icon: '/img/icons/ethereum.svg',
  },
  Waves: {
    id: '2',
    label: 'Waves Stagenet',
    icon: '/img/icons/waves.svg',
  },
  BSC: {
    id: '3',
    label: 'BSC Testnet',
    icon: 'https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png',
  },
}
