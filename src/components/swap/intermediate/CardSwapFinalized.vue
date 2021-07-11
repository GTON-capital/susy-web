<template>
  <card-swap-final>
    <template v-slot:header>
      {{ heading }}
    </template>
    <template v-slot:bodyTop>
      <form-group>
        <transactions-icons :left="swapForm.sourceChain" :right="swapForm.destinationChain"></transactions-icons>
      </form-group>
    </template>
    <template v-slot:bodyBottom>
      <form-group>
        <template v-slot:label>
          From address
        </template>
        <div class="text-truncate">
          {{ swapForm.sourceAddress }}
        </div>
      </form-group>
      <form-group>
        <template v-slot:label>
          To address
        </template>
        <div class="text-truncate">
          {{ swapForm.destinationAddress }}
        </div>
      </form-group>

      <form-group-between-shift>
        <template v-slot:left>
          <search-select :value="swapForm.token" readonly>
            <template v-slot:label>
              Token
              <span class="text-secondary float-right font-weight-normal"> Balance: {{ swapForm.formattedBalance }} </span>
            </template>
          </search-select>
        </template>
        <template v-slot:right>
          <form-input :value="swapForm.tokenAmount" type="number" readonly>
            <template v-slot:label>
              Receive
              <span class="text-gwei text-secondary float-right font-weight-normal">
                Gas: 100 Gwei
              </span>
            </template>
            <template v-slot:append>
              <span style="display: block; padding: 0 15px;">{{ swapForm.token.ticker }}</span>
            </template>
          </form-input>
        </template>
      </form-group-between-shift>
    </template>

    <template v-slot:footer>
      <div style="display: flex; justify-content: center;">
        <form-group>
          <checkbox v-model="termsChecked" name="terms-of-service">
            <a href="https://explorer.gravity.tech/docs/pdf/Gravity_Terms_of_Use_15.07.2020.pdf" target="_blank">Terms of Service</a>
          </checkbox>
        </form-group>
      </div>
      <btn class="btn-primary btn-block" :disabled="!termsChecked || swapProps.transferIsBeingProcessed" @click="$emit('swap')">
        Swap
      </btn>
      <btn class="btn-link btn-block" @click="$emit('back')">
        Back
      </btn>
    </template>
  </card-swap-final>
</template>

<script>
import CardSwapFinal from "~/components/swap/CardSwapFinal.vue"
import FormGroup from "~/components/FormGroup.vue"
import TransactionsIcons from "~/components/TransactionsIcons.vue"
import Btn from "~/components/Btn.vue"
import FormInput from "~/components/FormInput.vue"
import SearchSelect from "~/components/SearchSelect.vue"
import FormGroupBetweenShift from "~/components/FormGroupBetweenShift.vue"

export default {
  name: "CardSwapFinalized",
  components: {
    CardSwapFinal,
    FormGroup,
    TransactionsIcons,
    Btn,
    FormInput,
    SearchSelect,
    FormGroupBetweenShift,
  },
  props: ["swapProps", "heading", "tokens"],
  data() {
    return {
      termsChecked: false,
    }
  },
  computed: {
    swapForm() {
      return this.swapProps.swapForm
    },
  },
}
</script>

<style scoped>
.text-gwei {
  visibility: hidden;
}
</style>
