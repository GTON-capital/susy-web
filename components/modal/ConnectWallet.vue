<template>
  <modal name="accounts">
    <modal-content :show-footer="false">
      <template v-slot:head>Accounts</template>
      <template v-slot:body>
        <div
          class="text-center"
          style="margin-top: -28px; margin-bottom: 20px;"
        >
          <btn class="btn-link text-secondary font-weight-normal"
            >Logout of all wallets</btn
          >
        </div>
        <radio-provider-group style="margin-bottom: 24px;">
          <radio-account
            name="account"
            :walletData="wallets.metamask"
            @change="handleChange"
            @connect="handleConnect"
            @logout="handleLogout"
          ></radio-account>
          <radio-account
            name="account"
            :walletData="wallets.keeper"
            @change="handleChange"
            @connect="handleConnect"
            @logout="handleLogout"
          ></radio-account>
          <!-- <radio-account name="account" :wallet="walletFirst"></radio-account> -->
        </radio-provider-group>
        <div class="text-center">
          <btn
            class="btn-link"
            style="padding-left: 22px; padding-right: 22px;"
            @click="goBack"
            >Back</btn
          >
          <btn
            class="btn-link text-secondary"
            style="padding-left: 22px; padding-right: 22px;"
            >Logs</btn
          >
        </div>
      </template>
    </modal-content>
  </modal>
</template>

<script lang="ts">
// import Vue from 'vue'
import RadioProvider from '~/components/RadioProvider.vue'
import RadioAccount from '~/components/RadioAccount.vue'
import RadioProviderGroup from '~/components/RadioProviderGroup.vue'
import ModalContent from '~/components/ModalContent.vue'
import Btn from '~/components/Btn.vue'

import Keeper from '~/services/wallets/Keeper'
import Web3WalletConnector from '~/services/wallets/Web3'

interface ExtensionWallet {
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

type Wallets = {
  [key: string]: ExtensionWallet;
  metamask: ExtensionWallet;
  keeper: ExtensionWallet;
}

enum WalletProvider {
  Metamask = 'metamask',
  WavesKeeper = 'keeper',
}

// export default Vue.extend({
export default {
  name: 'ConnectWalletModal',
  props: ['wavesKeeper'],
  components: {
    Btn,
    ModalContent,
    RadioProvider,
    RadioAccount,
    RadioProviderGroup,
  },
  data: function () {
    return {
      wallets: {
        [WalletProvider.Metamask]: {
          wallet: {
            id: '1-0',
            label: 'Ethereum',
            icon: '/img/icons/metamask.svg',
          },
          provider: WalletProvider.Metamask,
          isConnected: false,
          label: 'Connect with Metamask',
        },
        [WalletProvider.WavesKeeper]: {
          wallet: {
            id: '2-0',
            label: 'Waves',
            icon: '/img/icons/waves.svg',
          },
          provider: WalletProvider.WavesKeeper,
          isConnected: false,
          label: 'Connect with Keeper',
        },
      } as Wallets,
    }
  },
  methods: {
    connectKeeper: function () {},
    handleChange: function (wallet: ExtensionWallet) {
      this.updateWalletData(wallet.provider as WalletProvider, { checked: true })
    },
    updateWalletData: function (
      provider: WalletProvider,
      body: Partial<ExtensionWallet>
    ) {
      console.log({ provider, body })
      const { wallets } = this

      for (const wallet of Object.keys(wallets)) {
        wallets[wallet].checked = false
      }

      this.wallets = {
        ...wallets,
        [provider]: {
          ...this.wallets[provider],
          ...body,
        },
      }
    },
    handleLogout: function (wallet: ExtensionWallet) {
      const existing = Object.keys(this.wallets)
      let walletToEnable: WalletProvider | undefined;

      for (const existingWallet of existing) {
        if (wallet.provider !== existingWallet) {
          walletToEnable = existingWallet as WalletProvider
          break
        }
      }

      this.updateWalletData(wallet.provider as WalletProvider, { checked: false, isConnected: false, value: "" })

      if (!walletToEnable) {
        return
      }

      this.updateWalletData(walletToEnable, { checked: true })
    },
    handleConnect: async function (wallet: ExtensionWallet) {
      // console.log({ data }, 'connect occured')

      if (wallet.provider === WalletProvider.Metamask) {
        const connector = new Web3WalletConnector()
        const isConnected = connector.ethEnabled()

        if (!isConnected) {
          return
        }

        this.updateWalletData(wallet.provider, {
          isConnected: true,
          value: window.web3.eth.accounts.givenProvider.selectedAddress,
          checked: true,
        })

        return
      }

      if (wallet.provider === WalletProvider.WavesKeeper) {
        // const keeper = (this.wavesKeeper as Keeper)
        const keeper = new Keeper()
        const address = await keeper.getAddress()

        this.updateWalletData(wallet.provider, {
          isConnected: true,
          value: address as string,
          checked: true,
        })
      }
    },
    goBack: function () {
      // @ts-ignore
      this.$modal.pop()
    },
  },
}
</script>
