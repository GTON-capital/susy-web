<template>
  <card class="card-swap-final">
    <template v-slot:header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </card>
</template>

<script>
import Vue from 'vue'
import Card from '~/components/Card.vue'

export default Vue.extend({
  name: 'CardSwapFinal',
  components: { Card },
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.card-swap-final {
  hr {
    margin-top: $form-group-margin-bottom-sm - 11px;
    margin-bottom: $form-group-margin-bottom-sm;
    @include media-breakpoint-up(sm) {
      margin-top: $form-group-margin-bottom - 11px;
      margin-bottom: $form-group-margin-bottom;
    }
  }
}
</style>
