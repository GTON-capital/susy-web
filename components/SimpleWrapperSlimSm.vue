<template>
  <div class="simple-wrapper-slim-sm"><slot></slot></div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'SimpleWrapperSlimSm',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.simple-wrapper-slim-sm {
  @include media-breakpoint-up(sm) {
    --input-disabled-bg: #{$input-disabled-gray-bg};
    padding: 17px 20px 16px 20px;
    background-color: $secondary-light;
    border-radius: 8px;
    margin-bottom: 18px;
  }
}
</style>
