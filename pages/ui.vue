<template>
  <div class="container">
    <btn class="btn-primary" @click="$modal.push('providers')">
      Accounts > Ethereum
    </btn>
    <btn class="btn-primary" @click="$modal.push('logs')">
      Logs
    </btn>
    <btn class="btn-primary" @click="$modal.push('accounts')">
      Accounts
    </btn>
    <checkbox v-model="isGravityTheme" name="is-gravity-theme">
      Gravity Theme
    </checkbox>
    <client-only>
      <ActionLogsModal :page="page" />
      <ConnectWalletModal
        :walletSecond="walletSecond"
        :walletFirst="walletFirst"
      />
      <WalletProvider :walletSecond="walletSecond" :walletFirst="walletFirst" />
    </client-only>

    <CardSwapNoWallet
      :wallets="wallets"
      :walletA="walletFirst"
      :walletB="walletSecond"
      :walletC="walletThree"
    />
    <CardSwapWalletConnected
      :wallets="wallets"
      :walletA="walletFirst"
      :walletB="walletSecond"
      :walletC="walletThree"
    />

    <CardSwapFinalized
      heading="Swap"
      :wallets="wallets"
      :walletA="walletFirst"
      :walletB="walletSecond"
      :walletC="walletThree"
    />
    <CardSwapFinalized
      heading="Withdraw"
      :wallets="wallets"
      :walletA="walletFirst"
      :walletB="walletSecond"
      :walletC="walletThree"
    />

    <WithdrawCard>
      <template v-slot:header>
        Withdraw
      </template>
      <simple-wrapper>
        <form-input value="1.1" readonly>
          <template v-slot:append>
            wETH
          </template>
          <template v-slot:label>
            Receive
          </template>
        </form-input>
        <form-input value="3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw" readonly>
          <template v-slot:label>
            From address
          </template>
        </form-input>
        <form-input
          value="3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw"
          style="margin-bottom: 10px;"
        >
          <template v-slot:label>
            To address
          </template>
        </form-input>
      </simple-wrapper>
      <template v-slot:footer>
        <btn class="btn-primary btn-block">
          Withdraw
        </btn>
        <btn class="btn-link btn-block">
          Back
        </btn>
      </template>
    </WithdrawCard>
  </div>
</template>

<script>
import Vue from 'vue'
import Btn from '~/components/Btn.vue'
import FormInput from '~/components/FormInput.vue'
import SimpleWrapper from '~/components/SimpleWrapper.vue'
import SimpleWrapperSlimSm from '~/components/SimpleWrapperSlimSm.vue'
import FormGroup from '~/components/FormGroup.vue'
import FormGroupBetween from '~/components/FormGroupBetween.vue'
import FormGroupBetweenShift from '~/components/FormGroupBetweenShift.vue'
import FormGroupBetweenShift1 from '~/components/FormGroupBetweenShift1.vue'
import SearchSelect from '~/components/SearchSelect.vue'
import Checkbox from '~/components/Checkbox.vue'
import Icon from '~/components/Icon.vue'
import TransactionsIcons from '~/components/TransactionsIcons.vue'
// import ModalContent from '~/components/ModalContent.vue'
import RadioProvider from '~/components/RadioProvider.vue'
// import RadioAccount from '~/components/RadioAccount.vue'
import RadioProviderGroup from '~/components/RadioProviderGroup.vue'
import TableLog from '~/components/TableLog.vue'
import Pagination from '~/components/Pagination.vue'

// MODAL
import ConnectWalletModal from '~/components/modal/ConnectWallet'
import WalletProvider from '~/components/modal/WalletProvider'
import ActionLogsModal from '~/components/modal/ActionLogsModal'

// SWAP
import WithdrawCard from '~/components/swap/WithdrawCard.vue'
import CardSwap from '~/components/swap/CardSwap'
import CardSwapFinal from '~/components/swap/CardSwapFinal.vue'

// SWAP INTERMEDIATE
import CardSwapNoWallet from '~/components/swap/intermediate/CardSwapNoWallet.vue'
import CardSwapWalletConnected from '~/components/swap/intermediate/CardSwapWalletConnected.vue'
import CardSwapFinalized from '~/components/swap/intermediate/CardSwapFinalized.vue'

export default Vue.extend({
  components: {
    WithdrawCard,
    Btn,
    FormInput,
    SimpleWrapper,
    CardSwap,
    CardSwapFinal,
    SimpleWrapperSlimSm,
    FormGroup,
    FormGroupBetween,
    FormGroupBetweenShift,
    FormGroupBetweenShift1,
    SearchSelect,
    Icon,
    TransactionsIcons,
    Checkbox,
    RadioProvider,
    RadioProviderGroup,
    TableLog,
    Pagination,
    ConnectWalletModal,
    WalletProvider,
    ActionLogsModal,
    CardSwapNoWallet,
    CardSwapWalletConnected,
    CardSwapFinalized,
    // exchangeIcon: () => import('assets/icons/exchange.svg?inline'),
  },
  data: () => ({
    isGravityTheme: false,
    page: 1,
    wallets: [],
    walletFirst: {
      id: '1-0',
      label: 'Ethereum',
      icon: '/img/icons/ethereum.svg',
    },
    walletSecond: {
      id: '2-0',
      label: 'Waves',
      icon: '/img/icons/waves.svg',
    },
    walletThree: undefined,
  }),
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
  },
  watch: {
    isGravityTheme(isGravityTheme) {
      // eslint-disable-next-line no-console
      console.log(isGravityTheme, isGravityTheme ? 'gravity' : 'susy')
      this.$store.dispatch('theme/setTheme', {
        theme: isGravityTheme ? 'gravity' : 'susy',
      })
    },
  },
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', false)
    const wallets = [
      {
        id: '1',
        label: 'Ethereum',
        icon: '/img/icons/ethereum.svg',
      },
      {
        id: '2',
        label: 'Waves',
        icon: '/img/icons/waves.svg',
      },
      {
        id: '3',
        label: 'NEO',
        icon: '/img/icons/neo.svg',
      },
      {
        id: '4',
        label: 'Tron',
        icon: '/img/icons/tron.svg',
      },
    ]
    for (let i = 0; i < 20; i++) {
      wallets.forEach((wallet) => {
        const newWallet = { ...wallet }
        newWallet.id = newWallet.id + '-' + String(i)
        // @ts-ignore
        this.wallets.push(newWallet)
      })
    }
  },
  methods: {
    walletRotate() {
      const walletFirst = { ...this.walletFirst }
      this.walletFirst = { ...this.walletSecond }
      this.walletSecond = walletFirst
    },
  },
})
</script>

<style lang="scss"></style>
