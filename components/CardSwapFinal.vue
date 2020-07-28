<template>
  <card class="card-swap-final">
    <template v-slot:header>
      <slot name="header"></slot>
    </template>
    <div class="card-swap-final-body">
      <div class="card-swap-final-top">
        <slot name="bodyTop"></slot>
        <hr />
      </div>
      <div class="card-swap-final-bottom">
        <slot name="bodyBottom"></slot>
      </div>
    </div>
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
    display: none;
    @include media-breakpoint-up(sm) {
      display: block;
      margin-bottom: $form-group-margin-bottom;
    }
  }
}
.card-swap-final-body {
  @include media-breakpoint-up(sm) {
    padding: 24px 30px;
    background-color: $secondary-light;
    border-radius: 8px;
    margin-bottom: 20px;
  }
}
.card-swap-final-bottom {
  background-color: $secondary-light;
}
</style>
