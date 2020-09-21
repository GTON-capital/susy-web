<template>
  <ul class="list-data">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'ListData',
}
</script>

<style lang="scss">
.list-data {
  margin-bottom: 0;
  list-style: none;
  padding: 0;
}
</style>
