<template>
  <div class="form-group-between-shift-invert1">
    <div><slot name="left"></slot></div>
    <div><slot name="right"></slot></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FormGroupBetweenShiftInvert1',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.form-group-between-shift-invert1 {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
    &:nth-child(2) {
      display: flex;
      justify-content: center;
    }
    @include media-breakpoint-up(sm) {
      &:nth-child(2) {
        flex: 0 0 200px;
        max-width: 200px;
        padding-left: 22px;
        justify-content: flex-end;
        align-items: flex-end;
      }
      &:nth-child(1) {
        flex-basis: 0;
        flex-grow: 1;
        min-width: 0;
        max-width: 100%;
      }
    }
    @include media-breakpoint-down(xs) {
      &:nth-child(2) {
        order: 1;
      }
      &:nth-child(1) {
        order: 2;
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
