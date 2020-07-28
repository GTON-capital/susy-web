<template>
  <div class="form-group-between">
    <div><slot name="left"></slot></div>
    <div><slot name="center"></slot></div>
    <div><slot name="right"></slot></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FormGroupBetween',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.form-group-between {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6px;
  > div {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
    &:nth-child(2) {
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
  }
  .form-group {
    margin-bottom: 8px;
  }
}
@include media-breakpoint-up(sm) {
  .form-group-between {
    margin-bottom: 0;
    > div {
      &:nth-child(1),
      &:nth-child(3) {
        flex-basis: 0;
        flex-grow: 1;
        min-width: 0;
        max-width: 100%;
      }
      &:nth-child(2) {
        flex: 0 0 80px;
        max-width: 80px;
      }
    }
    .form-group {
      margin-bottom: 0;
    }
  }
}
</style>
