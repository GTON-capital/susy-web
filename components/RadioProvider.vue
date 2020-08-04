<template>
  <label class="radio-provider">
    <input
      :type="type"
      :name="name"
      :checked="checked"
      :value="data && data.id"
      class="hide radio-provider-input"
      @change="$emit('change', $event)"
    />
    <span v-if="data" class="radio-provider-label">
      {{ data.label }}
    </span>
    <span v-if="data" class="radio-provider-icon">
      <icon :image="data.icon"></icon>
    </span>
  </label>
</template>

<script>
import Vue from 'vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'RadioProvider',
  components: { Icon },
  props: {
    type: {
      type: String,
      default: () => 'radio',
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
    data: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';
// stylelint-disable selector-no-qualifying-type

.radio-provider {
  position: relative;
  display: block;
  width: 100%;
  cursor: pointer;
  margin-bottom: 0;
  + .radio-provider {
    margin-top: $form-group-margin-bottom-sm;
    @include media-breakpoint-up(sm) {
      margin-top: $form-group-margin-bottom;
    }
  }
}
.radio-provider-label {
  display: block;
  padding: 34px 90px 33px 45px;
  position: relative;
  font-weight: 600;
  min-height: 85px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid;
  border-color: $base-border-color;
  box-shadow: $base-box-shadow;
  &:before,
  &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  &:before {
    left: 15px;
    top: 32px;
    width: 22px;
    height: 22px;
    border: 2px solid;
    border-color: $success;
  }
  &:after {
    left: 22px;
    top: 39px;
    width: 8px;
    height: 8px;
    background-color: $success;
    display: none;
  }
}
.radio-provider-icon {
  position: absolute;
  top: 14px;
  right: 22px;
  width: 58px;
  height: 58px;
  border-radius: 50%;

  background: #ffffff;
  border: 1px solid;
  border-color: $base-border-color;
  box-shadow: $base-box-shadow;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    width: 27px;
    height: 27px;
  }
}

.radio-provider-input:checked {
  ~ {
    .radio-provider-label {
      border-color: $success;
      &:after {
        display: block;
      }
    }
  }
}
</style>
