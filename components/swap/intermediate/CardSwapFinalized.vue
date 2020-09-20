<template>
  <card-swap-final>
    <template v-slot:header>
      {{ heading }}
    </template>
    <template v-slot:bodyTop>
      <form-group>
        <transactions-icons
          :left="walletA"
          :right="walletB"
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
</template>

<script>
import CardSwapFinal from '~/components/swap/CardSwapFinal.vue'
import FormGroup from '~/components/FormGroup.vue'
import TransactionsIcons from '~/components/TransactionsIcons.vue'
import Btn from '~/components/Btn.vue'
import FormInput from '~/components/FormInput.vue'
import SimpleWrapperSlimSm from '~/components/SimpleWrapperSlimSm.vue'
import FormGroupBetween from '~/components/FormGroupBetween.vue'
import SearchSelect from '~/components/SearchSelect.vue'
import CardSwap from '~/components/swap/CardSwap'
import FormGroupBetweenShift from '~/components/FormGroupBetweenShift.vue'
import FormGroupBetweenShift1 from '~/components/FormGroupBetweenShift1.vue'

export default {
  name: 'CardSwapFinalized',
  props: ['heading', 'wallets', 'walletA', 'walletB'],
  components: {
    CardSwapFinal,
    FormGroup,
    TransactionsIcons,
    Btn,
    FormInput,
    SimpleWrapperSlimSm,
    FormGroupBetween,
    SearchSelect,
    CardSwap,
    FormGroupBetweenShift,
    FormGroupBetweenShift1,
  },
}
</script>
