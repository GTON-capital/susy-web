<template>
  <div class="form-group-between-shift"><slot></slot></div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FormGroupBetweenShift',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.btn-between {
}
</style>
