<template>
  <modal name="providers">
    <modal-content :show-footer="false">
      <template v-slot:head> <span class="text-secondary">Accounts ></span> Ethereum </template>
      <template v-slot:body>
        <radio-provider-group style="margin-bottom: 24px;">
          <!-- <radio-provider name="provider" :data="walletFirst"></radio-provider>
          <radio-provider name="provider" :data="walletSecond"></radio-provider>
          <radio-provider name="provider" :data="walletFirst"></radio-provider> -->
          <radio-provider v-for="wallet in walletsList" :key="wallet.id" name="provider" :data="wallet"></radio-provider>
        </radio-provider-group>
        <div class="text-center">
          <btn class="btn-link btn-block text-secondary">
            Learn more about Ethereum wallets
          </btn>
          <btn class="btn-link btn-block" style="margin-top: 0;">
            Back
          </btn>
        </div>
      </template>
    </modal-content>
  </modal>
</template>

<script>
import RadioProvider from "~/components/RadioProvider.vue"
import RadioProviderGroup from "~/components/RadioProviderGroup.vue"
import ModalContent from "~/components/ModalContent.vue"
import Btn from "~/components/Btn.vue"

export default {
  name: "WalletProvider",
  props: ["walletsList"],
  components: {
    Btn,
    ModalContent,
    RadioProvider,
    RadioProviderGroup,
  },
}
</script>
