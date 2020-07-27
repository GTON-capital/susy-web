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
  </div>
</template>

<script>
import Vue from 'vue'
import Card from '~/components/Card'
import Btn from '~/components/Btn'

export default Vue.extend({
  components: { Card, Btn },
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', true)
  },
})
</script>

<style lang="scss"></style>
