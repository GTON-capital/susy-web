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
      <ActionLogsModal :page="page"/>
      <ConnectWalletModal :walletSecond="walletSecond" :walletFirst="walletFirst" />
      <WalletProvider  :walletSecond="walletSecond" :walletFirst="walletFirst" />
    </client-only>
    <card-swap>
      <template v-slot:header>
        Swap
      </template>
      <simple-wrapper-slim-sm>
        <form-group-between>
          <template v-slot:left>
            <search-select
              v-model="walletFirst"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
            >
              <template v-slot:label>
                Origin
              </template>
            </search-select>
          </template>
          <template v-slot:center>
            <button
              class="btn btn-circle btn-secondary-gradient"
              @click="walletRotate"
            >
              <icon>
                <exchange-icon></exchange-icon>
              </icon>
            </button>
          </template>
          <template v-slot:right>
            <search-select
              v-model="walletSecond"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
            >
              <template v-slot:label>
                Destination
              </template>
            </search-select>
          </template>
        </form-group-between>
      </simple-wrapper-slim-sm>

      <btn
        class="btn-link btn-block"
        :class="{
          'link-invert': theme === 'susy',
          'text-primary': theme === 'gravity',
        }"
      >
        Connect new wallet
      </btn>

      <hr />

      <form-input value="3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw">
        <template v-slot:label>
          To address
        </template>
      </form-input>

      <simple-wrapper-slim-sm>
        <form-group-between-shift>
          <template v-slot:left>
            <search-select
              v-model="walletThree"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
            >
              <template v-slot:label>
                Token
              </template>
            </search-select>
          </template>
          <template v-slot:right>
            <form-input value="0" type="number">
              <template v-slot:label>
                Receive
              </template>
            </form-input>
          </template>
        </form-group-between-shift>
      </simple-wrapper-slim-sm>

      <template v-slot:footer>
        <btn class="btn-primary btn-block" disabled>
          Next
        </btn>
      </template>
    </card-swap>

    <card-swap>
      <template v-slot:header>
        Swap
      </template>

      <simple-wrapper-slim-sm>
        <form-group-between>
          <template v-slot:left>
            <search-select
              v-model="walletFirst"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
            >
              <template v-slot:label>
                Origin
              </template>
            </search-select>
          </template>
          <template v-slot:center>
            <button
              class="btn btn-circle btn-secondary-gradient"
              @click="walletRotate"
            >
              <icon>
                <exchange-icon></exchange-icon>
              </icon>
            </button>
          </template>
          <template v-slot:right>
            <search-select
              v-model="walletSecond"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
            >
              <template v-slot:label>
                Destination
              </template>
            </search-select>
          </template>
        </form-group-between>
      </simple-wrapper-slim-sm>

      <form-group-between-shift1>
        <template v-slot:left>
          <form-input
            value="0x1015e2182E...6AD26FB9"
            readonly
            icon="/img/icons/metamask.svg"
          >
            <template v-slot:label>
              From address
            </template>
          </form-input>
        </template>
        <template v-slot:right>
          <btn class="btn-link link-invert btn-block">
            Change wallet
          </btn>
        </template>
      </form-group-between-shift1>

      <hr class="d-md-none" style="margin: 5px 0 14px 0;" />

      <form-input value="3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw">
        <template v-slot:label>
          To address
        </template>
      </form-input>

      <simple-wrapper-slim-sm>
        <form-group-between-shift>
          <template v-slot:left>
            <search-select
              v-model="walletThree"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
            >
              <template v-slot:label>
                Token
                <span class="text-secondary float-right font-weight-normal">
                  Balance: 1
                </span>
              </template>
            </search-select>
          </template>
          <template v-slot:right>
            <form-input value="0" type="number">
              <template v-slot:label>
                Receive
                <span class="text-secondary float-right font-weight-normal">
                  Gas: 100 Gwei
                </span>
              </template>
            </form-input>
          </template>
        </form-group-between-shift>
      </simple-wrapper-slim-sm>

      <template v-slot:footer>
        <btn class="btn-primary btn-block" disabled>
          Next
        </btn>
      </template>
    </card-swap>

    <card-swap-final>
      <template v-slot:header>
        Swap
      </template>
      <template v-slot:bodyTop>
        <form-group>
          <transactions-icons
            :left="walletFirst"
            :right="walletSecond"
          ></transactions-icons>
        </form-group>
      </template>
      <template v-slot:bodyBottom>
        <form-group>
          <template v-slot:label>
            From address
          </template>
          <div class="text-truncate">
            0xEA3ed91a668B6a56751729016EBafc214dFBeB65
          </div>
        </form-group>
        <form-group>
          <template v-slot:label>
            To address
          </template>
          <div class="text-truncate">
            3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw
          </div>
        </form-group>

        <form-group-between-shift>
          <template v-slot:left>
            <search-select
              :value="{
                id: '1',
                label: 'Ethereum',
                icon: '/img/icons/ethereum.svg',
              }"
              readonly
            >
              <template v-slot:label>
                Token
                <span class="text-secondary float-right font-weight-normal">
                  Balance: 1
                </span>
              </template>
            </search-select>
          </template>
          <template v-slot:right>
            <form-input value="1.1" type="number" readonly>
              <template v-slot:label>
                Receive
                <span class="text-secondary float-right font-weight-normal">
                  Gas: 100 Gwei
                </span>
              </template>
              <template v-slot:append>
                <span style="display: block; padding: 0 15px;">wETH</span>
              </template>
            </form-input>
          </template>
        </form-group-between-shift>
      </template>

      <template v-slot:footer>
        <div style="display: flex; justify-content: center;">
          <form-group>
            <checkbox name="terms-of-service" checked>
              Terms of Service
            </checkbox>
          </form-group>
        </div>
        <btn class="btn-primary btn-block">
          Swap
        </btn>
        <btn class="btn-link btn-block">
          Back
        </btn>
      </template>
    </card-swap-final>

    <card-swap-final>
      <template v-slot:header>
        Withdraw
      </template>
      <template v-slot:bodyTop>
        <form-group>
          <transactions-icons
            :left="walletFirst"
            :right="walletSecond"
          ></transactions-icons>
        </form-group>
      </template>
      <template v-slot:bodyBottom>
        <form-group>
          <template v-slot:label>
            From address
          </template>
          <div class="text-truncate">
            0xEA3ed91a668B6a56751729016EBafc214dFBeB65
          </div>
        </form-group>
        <form-group>
          <template v-slot:label>
            To address
          </template>
          <div class="text-truncate">
            3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw
          </div>
        </form-group>

        <form-group-between-shift>
          <template v-slot:left>
            <search-select
              :value="{
                id: '1',
                label: 'Ethereum',
                icon: '/img/icons/ethereum.svg',
              }"
              readonly
            >
              <template v-slot:label>
                Token
                <span class="text-secondary float-right font-weight-normal">
                  Balance: 1
                </span>
              </template>
            </search-select>
          </template>
          <template v-slot:right>
            <form-input value="1.1" type="number" readonly>
              <template v-slot:label>
                Receive
                <span class="text-secondary float-right font-weight-normal">
                  Gas: 100 Gwei
                </span>
              </template>
              <template v-slot:append>
                <span style="display: block; padding: 0 15px;">wETH</span>
              </template>
            </form-input>
          </template>
        </form-group-between-shift>
      </template>

      <template v-slot:footer>
        <div style="display: flex; justify-content: center;">
          <form-group>
            <checkbox name="terms-of-service">
              Terms of Service
            </checkbox>
          </form-group>
        </div>
        <btn class="btn-primary btn-block">
          Withdraw
        </btn>
        <btn class="btn-link btn-block">
          Back
        </btn>
      </template>
    </card-swap-final>

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
import WithdrawCard from '~/components/swap/WithdrawCard.vue'
import Btn from '~/components/Btn.vue'
import FormInput from '~/components/FormInput.vue'
import SimpleWrapper from '~/components/SimpleWrapper.vue'
import CardSwap from '~/components/swap/CardSwap'
import CardSwapFinal from '~/components/swap/CardSwapFinal.vue'
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
import ConnectWalletModal from '~/components/modal/ConnectWallet'
import WalletProvider from '~/components/modal/WalletProvider'
import ActionLogsModal from '~/components/modal/ActionLogsModal'


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
    exchangeIcon: () => import('assets/icons/exchange.svg?inline'),
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
