<template>
  <label class="checkbox">
    <input
      :type="type"
      :name="name"
      :checked="checked"
      class="hide checkbox-input"
      @change="$emit('change', $event)"
    />
    <span class="checkbox-label">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Checkbox',
  props: {
    type: {
      type: String,
      default: () => 'checkbox',
      required: false,
    },
    checked: {
      type: Boolean,
      default: () => false,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';
// stylelint-disable selector-no-qualifying-type

.checkbox {
  position: relative;
  display: block;
}
.checkbox-label {
  position: relative;
  display: block;
  padding-top: 2px;
  padding-left: 28px;
  cursor: pointer;
  color: $secondary;
  font-size: 13px;
  font-weight: 400;
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
    pointer-events: none;
  }
  &:before {
    border: 1px solid;
    border-color: $primary;
    border-radius: 4px;
  }
  &:after {
    opacity: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 12px 10px;
    background-image: url(escape-svg(
      'data:image/svg+xml,<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.30664 4L5 8.56055L10.6777 0.654297" stroke="#FF0097"/></svg>'
    ));
  }
}

.checkbox-input:checked {
  ~ {
    .checkbox-label {
      &:after {
        opacity: 1;
      }
    }
  }
}
</style>
