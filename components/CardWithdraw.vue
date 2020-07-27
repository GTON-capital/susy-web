<template>
  <card>
    <template v-slot:header>
      <slot name="header"></slot>
    </template>
    <div class="card-withdraw-content"><slot></slot></div>
    <slot name="footer"></slot>
  </card>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CardWithdraw',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.card-withdraw-content {
  @include media-breakpoint-up(sm) {
    padding: 17px 30px;
    background-color: $secondary-light;
    border-radius: 8px;
    margin-bottom: 34px;
  }
}
</style>
