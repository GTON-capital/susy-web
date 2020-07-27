<template>
  <div class="simple-wrapper-slim"><slot></slot></div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'SimpleWrapperSlim',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.simple-wrapper-slim {
  @include media-breakpoint-up(sm) {
    padding: 17px 20px 16px 20px;
    background-color: $secondary-light;
    border-radius: 8px;
    margin-bottom: 18px;
  }
}
</style>
