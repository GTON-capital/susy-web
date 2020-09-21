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
            @connect="$emit('connect', $event)"
            @logout="handleLogout"
          ></radio-account>
          <radio-account
            name="account"
            :walletData="wallets.keeper"
            @change="handleChange"
            @connect="$emit('connect', $event)"
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

import Keeper from '~/services/wallets/keeper'
import Web3WalletConnector from '~/services/wallets/web3'
import { Wallets, WalletState, ExtensionWallet, WalletProvider } from '~/store/wallet/types'

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
    return {}
  },
  computed: {
    wallets: function (): WalletState {
      console.log({ state: this.$store })
      // @ts-ignore
      return this.$store.state.wallet
    },
  },
  methods: {
    connectKeeper: function () {},
    handleChange: function (wallet: ExtensionWallet) {
      this.$store.commit('wallet/updateWalletData', {
        provider: wallet.provider as WalletProvider,
        body: { checked: true },
      })
    },
    handleLogout: function (wallet: ExtensionWallet) {
      const existing = Object.keys(this.wallets)
      let walletToEnable: WalletProvider | undefined

      for (const existingWallet of existing) {
        if (wallet.provider !== existingWallet) {
          walletToEnable = existingWallet as WalletProvider
          break
        }
      }

      this.$store.commit('wallet/updateWalletData', {
        provider: wallet.provider as WalletProvider,
        body: { checked: false, isConnected: false, value: '' },
      })

      if (!walletToEnable) {
        return
      }

      this.$store.commit('wallet/updateWalletData', {
        provider: walletToEnable,
        body: { checked: true },
      })
    },
    goBack: function () {
      // @ts-ignore
      this.$modal.pop()
    },
  },
}
</script>
