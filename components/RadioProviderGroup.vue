<template>
  <div class="radio-provider-group"><slot></slot></div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RadioProviderGroup',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.radio-provider-group {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  @include media-breakpoint-up(sm) {
    background-color: $secondary-light;
    padding: 32px 30px;
  }
}
</style>
