<template>
  <div class="form-group-between-shift1">
    <div><slot name="left"></slot></div>
    <div><slot name="right"></slot></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FormGroupBetweenShift1',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.form-group-between-shift1 {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
    @include media-breakpoint-up(sm) {
      padding-bottom: $form-group-margin-bottom;
      &:nth-child(1) {
        flex-basis: 0;
        flex-grow: 1;
        min-width: 0;
        max-width: 100%;
      }
      &:nth-child(2) {
        flex: 0 0 auto;
        width: auto;
        max-width: 100%;
        display: flex;
        align-items: flex-end;
        .btn {
          padding-left: 16px;
          padding-right: 16px;
        }
      }
    }
  }
  .form-group {
    margin-bottom: 0;
  }
}
</style>
