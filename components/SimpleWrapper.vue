<template>
  <div class="simple-wrapper"><slot></slot></div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'SimpleWrapper',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.simple-wrapper {
  @include media-breakpoint-up(sm) {
    padding: 17px 30px;
    background-color: var(--secondary-light);
    border-radius: 8px;
    margin-bottom: 20px;
  }
}
</style>
