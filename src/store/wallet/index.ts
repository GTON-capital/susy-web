import { WalletState, WalletProvider, ExtensionWallet } from "./types"
// import { ActionContext } from "vuex"

export const state = (): WalletState => {
  return {
    [WalletProvider.Metamask]: {
      wallet: {
        id: "1-0",
        label: "Metamask",
        icon: "/img/icons/metamask.svg",
      },
      provider: WalletProvider.Metamask,
      isConnected: false,
      label: "Connect with Metamask",
    },
    [WalletProvider.WavesKeeper]: {
      wallet: {
        id: "2-0",
        label: "Waves",
        icon: "/img/icons/waves.svg",
      },
      provider: WalletProvider.WavesKeeper,
      isConnected: false,
      label: "Connect with Keeper",
    },
    [WalletProvider.MathWallet]: {
      wallet: {
        id: "3-0",
        label: "Math Wallet",
        icon: "/img/icons/mathwallet.png",
      },
      provider: WalletProvider.MathWallet,
      isConnected: false,
      label: "Connect with Math Wallet",
    },
    [WalletProvider.Phantom]: {
      wallet: {
        id: "3-0",
        label: "Phantom",
        icon: "/img/icons/phantom.png",
      },
      provider: WalletProvider.Phantom,
      isConnected: false,
      label: "Connect with Phantom",
    },
  }
}

export const actions = {}

export const mutations = {
  updateWalletData(
    state: WalletState,
    {
      provider,
      body,
    }: {
      provider: WalletProvider
      body: Partial<ExtensionWallet>
    }
  ) {
    for (const wallet of Object.keys(state)) {
      state[wallet].checked = false

      if (provider === state[wallet].provider) {
        state[wallet] = {
          ...state[wallet],
          ...body,
        }
      }
    }

    // wallets = {
    //   ...wallets,
    //   [provider]: {
    //     ...this.wallets[provider],
    //     ...body,
    //   },
    // }
  },
}

export const getters = {
  currentWallet: (state: WalletState): ExtensionWallet | undefined => {
    for (const wallet of Object.keys(state)) {
      if (state[wallet].checked) {
        return state[wallet]
      }
    }
  },
}
