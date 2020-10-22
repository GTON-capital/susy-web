<template>
  <div class="form-group-between-shift-invert">
    <div><slot name="left"></slot></div>
    <div><slot name="right"></slot></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FormGroupBetweenShiftInvert',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.form-group-between-shift-invert {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
    @include media-breakpoint-up(sm) {
      &:nth-child(2) {
        flex: 0 0 200px;
        max-width: 200px;
        padding-left: 22px;
      }
      &:nth-child(1) {
        flex-basis: 0;
        flex-grow: 1;
        min-width: 0;
        max-width: 100%;
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
