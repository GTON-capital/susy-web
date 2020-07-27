<template>
  <div class="card">
    <div class="card-content">
      <div class="card-header font-cormorant">
        <slot name="header"></slot>
      </div>
      <slot></slot>
      <div class="card-footer">
        <slot name="footer"></slot>
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
  background: #ffffff;
  border: 1px solid #eaf1f3;
  box-sizing: border-box;
  box-shadow: 0 1px 25px #e2f1f6;
  border-radius: 18px;
  max-width: 660px;
  margin-left: auto;
  margin-right: auto;
  @include media-breakpoint-only(md) {
    max-width: 100%;
  }
  padding: 14px 16px;
  @include media-breakpoint-up(md) {
    padding: 38px 0 44px 0;
  }
}
.card-content {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}
.card-header {
  font-weight: 600;
  font-size: 28px;
  text-align: center;
  margin-bottom: 28px;
  width: 100%;
}
.card-footer {
  padding-top: 34px;
  width: 100%;
}
</style>
