<template>
  <div class="card">
    <div class="card-wrapper">
      <div class="card-header headings-font-family">
        <slot name="header"></slot>
      </div>
      <div class="card-content">
        <slot></slot>
        <div class="card-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'WithdrawCard',
})
</script>

<style lang="scss">
@import '../../assets/scss/import';

.card {
  @include media-breakpoint-up(md) {
    background-color: $card-background-color;
    border: 1px solid;
    border-color: $base-border-color;
    box-shadow: $base-box-shadow;
    border-radius: 18px;
    max-width: 660px;
    margin-left: auto;
    margin-right: auto;
    padding: 38px 0 44px 0;
  }
  @include media-breakpoint-only(md) {
    max-width: 100%;
  }
  + .card {
    margin-top: 24px;
  }
}
.card-wrapper {
  @include media-breakpoint-up(md) {
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
  }
}
.card-header {
  font-weight: $card-header-font-weight;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  line-height: 1;
  font-size: $card-header-font-size;
  @include media-breakpoint-up(md) {
    margin-bottom: 28px;
    font-size: $card-header-font-size-md;
  }
}
.card-content {
  @include media-breakpoint-down(sm) {
    background-color: $card-background-color;
    border: 1px solid;
    border-color: $base-border-color;
    box-shadow: $base-box-shadow;
    border-radius: 8px;
    padding: 18px;
  }
}
.card-footer {
  padding-top: 14px;

  & > button {
    width: 100%;
  }
}
</style>
