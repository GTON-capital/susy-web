<template>
  <card class="card-swap">
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
import Vue from "vue"
import Card from "./WithdrawCard"

export default Vue.extend({
  name: "CardSwap",
  components: { Card },
})
</script>

<style lang="scss">
@import "../../assets/scss/import";

.card-swap {
  .card-header {
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
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
