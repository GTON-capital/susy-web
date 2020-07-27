<template>
  <div class="container">
    <card-swap>
      <template v-slot:header>
        Swap
      </template>

      <simple-wrapper-slim>
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
            center
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
      </simple-wrapper-slim>

      <btn class="btn-link btn-block link-invert">
        Connect new wallet
      </btn>

      <hr />

      <form-input value="3PAASSqnygiyYoQuqmXpwaSUJmRkqytwPaw">
        <template v-slot:label>
          To address
        </template>
      </form-input>

      <simple-wrapper-slim>
        awd
      </simple-wrapper-slim>

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
import SimpleWrapperSlim from '~/components/SimpleWrapperSlim.vue'
import FormGroupBetween from '~/components/FormGroupBetween.vue'
import SearchSelect from '~/components/SearchSelect.vue'

export default Vue.extend({
  components: {
    CardSwap,
    Btn,
    FormInput,
    SimpleWrapperSlim,
    FormGroupBetween,
    SearchSelect,
  },
  data: () => ({
    wallets: [],
    walletFirst: {
      id: '1-0',
      label: 'Ethereum Ethereum Ethereum Ethereum Ethereum Ethereum',
      icon: '/img/icons/ethereum.svg',
    },
    walletSecond: {
      id: '2-0',
      label: 'Waves',
      icon: '/img/icons/waves.svg',
    },
  }),
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', false)
    const wallets = [
      {
        id: '1',
        label: 'Ethereum Ethereum Ethereum Ethereum Ethereum Ethereum',
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
        this.wallets.push(newWallet)
      })
    }
  },
})
</script>

<style lang="scss"></style>
