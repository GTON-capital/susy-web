<template>
  <div class="container">
    <tabs
      :items="[
        {
          label: 'Swap',
          to: getTabLink(),
        },
        { label: 'Pools', to: getTabLink('pools') },
      ]"
    >
    </tabs>
    <card-swap>
      <template v-slot:header>
        Swap
      </template>

      <simple-wrapper-slim-sm>
        <search-select
          v-model="walletThree"
          :data="wallets"
          placeholder="Select a token..."
          modal-heading="Select a token"
          style="margin-bottom: 0;"
        >
          <template v-slot:label>
            Blockchain
          </template>
        </search-select>
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
      <hr class="d-sm-none" />
      <br class="d-none d-sm-block" />
      <simple-wrapper-slim-sm>
        <form-group-between-shift-invert>
          <template v-slot:left>
            <search-select
              v-model="walletThree"
              :data="wallets"
              placeholder="Select a token..."
              modal-heading="Select a token"
              style="margin-bottom: 14px;"
            >
              <template v-slot:label>
                Send
              </template>
            </search-select>
          </template>
          <template v-slot:right>
            <form-input-without-label>
              <form-input value="0" type="number" style="margin-bottom: 14px;">
              </form-input>
            </form-input-without-label>
          </template>
        </form-group-between-shift-invert>
        <form-group-between-shift-invert>
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
            <form-input-without-label>
              <form-input
                value="0"
                type="number"
                style="margin-bottom: 0;"
              ></form-input>
            </form-input-without-label>
          </template>
        </form-group-between-shift-invert>
      </simple-wrapper-slim-sm>
      <list-data class="d-none d-sm-block">
        <list-data-item>
          Exchange rate:
          <template v-slot:value>—</template>
        </list-data-item>
        <list-data-item>
          Current pool size:
          <template v-slot:value>—</template>
        </list-data-item>
        <list-data-item>
          Your pool share (50%):
          <template v-slot:value>—</template>
        </list-data-item>
      </list-data>
      <template v-slot:footer>
        <btn class="btn-primary btn-block" disabled>
          Next
        </btn>
        <list-data class="d-sm-none" style="margin-top: 14px;">
          <list-data-item>
            Exchange rate:
            <template v-slot:value>—</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>—</template>
          </list-data-item>
          <list-data-item style="margin-bottom: 0;">
            Your pool share (50%):
            <template v-slot:value>—</template>
          </list-data-item>
        </list-data>
      </template>
    </card-swap>
  </div>
</template>

<script>
import Tabs from '~/components/Tabs'
import Btn from '~/components/Btn'
import FormInput from '~/components/FormInput'
import CardSwap from '~/components/CardSwap'
import SimpleWrapperSlimSm from '~/components/SimpleWrapperSlimSm'
import FormGroupBetweenShiftInvert from '~/components/FormGroupBetweenShiftInvert'
import SearchSelect from '~/components/SearchSelect'
import ListData from '~/components/ListData'
import ListDataItem from '~/components/ListDataItem'
import FormInputWithoutLabel from '~/components/FormInputWithoutLabel'

const defaultTab = 'swap'

export default {
  components: {
    Btn,
    FormInput,
    CardSwap,
    SimpleWrapperSlimSm,
    FormGroupBetweenShiftInvert,
    SearchSelect,
    Tabs,
    ListData,
    ListDataItem,
    FormInputWithoutLabel,
  },
  data: () => ({
    defaultTab,
    tab: defaultTab,
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
    $route(to) {
      // @ts-ignore
      this.tab = to.query.tab || defaultTab
    },
  },
  created() {
    // @ts-ignore
    this.tab = this.$route.query.tab || defaultTab
  },
  mounted() {
    this.$store.commit(
      'app/SET_NAVBAR_TITLE',
      'Seamless Intrachain <br />Swaps'
    )
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
    getTabLink(tab) {
      const link = { name: this.$route.name }
      if (tab) {
        // @ts-ignore
        link.query = { tab }
      }
      return link
    },
  },
}
</script>

<style></style>
