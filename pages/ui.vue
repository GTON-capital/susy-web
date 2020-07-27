<template>
  <div class="container">
    <card>
      <template v-slot:header>
        Swap
      </template>
      <btn class="btn-primary btn-block">
        Next
      </btn>
    </card>
    <card>
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
    </card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '~/components/Card.vue'
import Btn from '~/components/Btn.vue'
import FormInput from '~/components/FormInput.vue'
import SimpleWrapper from '~/components/SimpleWrapper.vue'

export default Vue.extend({
  components: { Card, Btn, FormInput, SimpleWrapper },
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', true)
  },
})
</script>

<style lang="scss"></style>
