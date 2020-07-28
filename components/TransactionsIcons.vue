<template>
  <div class="transactions-icons"><slot></slot></div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'TransactionsIcons',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.transactions-icons {
}
</style>
