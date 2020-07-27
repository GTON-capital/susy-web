<template>
  <div class="container">
    <card>
      <template v-slot:header>
        Swap
      </template>
      <template v-slot:footer>
        <btn class="btn-primary btn-block">
          Next
        </btn>
      </template>
    </card>
  </div>
</template>

<script>
import Vue from 'vue'
import Card from '~/components/Card'
import Btn from '~/components/Btn'

export default Vue.extend({
  components: { Card, Btn },
})
</script>

<style lang="scss"></style>
