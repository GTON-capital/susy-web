<template>
  <div class="card">
    <div class="card-wrapper">
      <div class="card-header font-cormorant">
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
  name: 'Card',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.card {
  @include media-breakpoint-up(md) {
    background: #ffffff;
    border: 1px solid #eaf1f3;
    box-shadow: 0 1px 25px #e2f1f6;
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
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  line-height: 1;
  font-size: 32px;
  @include media-breakpoint-up(md) {
    margin-bottom: 28px;
    font-size: 28px;
  }
}
.card-content {
  @include media-breakpoint-down(sm) {
    background: #ffffff;
    border: 1px solid #eaf1f3;
    box-shadow: 0 1px 25px #e2f1f6;
    border-radius: 8px;
    padding: 18px 16px;
  }
}
.card-footer {
  padding-top: 14px;
}
</style>
