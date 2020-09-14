<template>
  <div class="container">
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
  </div>
</template>

<script>
import Vue from 'vue'
import CardSwap from '~/components/CardSwap.vue'
import Btn from '~/components/Btn.vue'
import FormInput from '~/components/FormInput.vue'
import SimpleWrapperSlimSm from '~/components/SimpleWrapperSlimSm.vue'
import FormGroupBetween from '~/components/FormGroupBetween.vue'
import FormGroupBetweenShift from '~/components/FormGroupBetweenShift.vue'
import SearchSelect from '~/components/SearchSelect.vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  components: {
    CardSwap,
    Btn,
    FormInput,
    SimpleWrapperSlimSm,
    FormGroupBetween,
    FormGroupBetweenShift,
    SearchSelect,
    Icon,
    exchangeIcon: () => import('assets/icons/exchange.svg?inline'),
  },
  data: () => ({
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
    this.wallets = wallets
    // for (let i = 0; i < 20; i++) {
    //   wallets.forEach((wallet) => {
    //     const newWallet = { ...wallet }
    //     newWallet.id = newWallet.id + '-' + String(i)
    //     // @ts-ignore
    //     this.wallets.push(newWallet)
    //   })
    // }
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
