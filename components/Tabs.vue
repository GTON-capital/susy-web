<template>
  <ul class="tabs">
    <li
      v-for="(item, index) in items"
      :key="index"
      class="tab headings-font-family"
    >
      <nuxt-link :to="item.to">
        {{ item.label }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.tabs {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
}
.tab {
  display: block;
  a {
    display: block;
    position: relative;
    padding: 8px 7px;
    color: $primary;
    cursor: pointer;
    font-weight: 600;
    font-size: 18px;
    line-height: lh(18px, 20px);
    margin: 0 13px;
    text-decoration: none !important;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background-color: $primary;
      opacity: 0;
      transition: 0.2s;
    }
    &:hover {
      &:before {
        opacity: 0.2;
      }
    }
    &.nuxt-link-exact-active {
      color: $body-color;
      &:before {
        opacity: 1;
      }
    }
  }
}
</style>
