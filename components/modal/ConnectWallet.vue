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
            :wallet="walletFirst"
            label="Connected with Metamask"
            value="0x1015e2182E...6AD26FB9"
          ></radio-account>
          <radio-account
            name="account"
            :wallet="walletSecond"
            label="Connected with Metamask"
            value="0x1015e2182E...6AD26FB9"
          ></radio-account>
          <radio-account name="account" :wallet="walletFirst"></radio-account>
        </radio-provider-group>
        <div class="text-center">
          <btn class="btn-link" style="padding-left: 22px; padding-right: 22px;"
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

<script>
// import Vue from 'vue'
import RadioProvider from '~/components/RadioProvider.vue'
import RadioAccount from '~/components/RadioAccount.vue'
import RadioProviderGroup from '~/components/RadioProviderGroup.vue'
import ModalContent from '~/components/ModalContent.vue'
import Btn from '~/components/Btn.vue'

// export default Vue.extend({
export default {
  name: 'ConnectWalletModal',
  props: ['walletFirst', 'walletSecond'],
  components: {
    Btn,
    ModalContent,
    RadioProvider,
    RadioAccount,
    RadioProviderGroup,
  },
}
</script>
