<template>
  <div class="form-input-without-label">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FormInputWithoutLabel',
}
</script>

<style lang="scss">
.form-input-without-label {
  display: flex;
  align-items: flex-end;
  height: 100%;
  .form-group {
    width: 100%;
  }
}
</style>
