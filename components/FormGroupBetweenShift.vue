<template>
  <div class="form-group-between-shift">
    <div><slot name="left"></slot></div>
    <div><slot name="right"></slot></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FormGroupBetweenShift',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.form-group-between-shift {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
    @include media-breakpoint-up(sm) {
      &:nth-child(1) {
        flex: 0 0 200px;
        max-width: 200px;
      }
      &:nth-child(2) {
        flex-basis: 0;
        flex-grow: 1;
        min-width: 0;
        max-width: 100%;
        padding-left: 22px;
      }
    }
  }
  .form-group {
    @include media-breakpoint-up(sm) {
      margin-bottom: 0;
    }
  }
}
</style>
