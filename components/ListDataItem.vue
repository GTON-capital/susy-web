<template>
  <li class="list-data-item">
    <slot></slot>
    <span class="list-data-item-value"><slot name="value"></slot></span>
  </li>
</template>

<script>
export default {
  name: 'ListDataItem',
}
</script>

<style lang="scss">
.list-data-item {
  display: block;
  font-size: 13px;
  line-height: lh(13px, 16px);
  margin-bottom: 10px;
}
.list-data-item-value {
  @include media-breakpoint-up(sm) {
    float: right;
  }
}
</style>
