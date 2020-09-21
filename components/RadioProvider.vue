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
      <span class="radio-provider-label-bg wrapper-box-rounded"></span>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="transparent"
        xmlns="http://www.w3.org/2000/svg"
        class="radio-provider-dot"
      >
        <circle
          cx="11"
          cy="11"
          r="10"
          fill="transparent"
          stroke="#00DD80"
          stroke-width="2"
        />
        <circle cx="11" cy="11" r="4" fill="#00DD80" />
      </svg>

      {{ data.label }}
    </span>
    <span v-if="data" class="radio-provider-icon wrapper-icon-circle">
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
.radio-provider-label-bg {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: $input-btn-border-radius;
  z-index: -1;
}
.radio-provider-label {
  display: block;
  padding: 34px 90px 33px 45px;
  position: relative;
  font-weight: 600;
  min-height: 85px;
  box-shadow: $base-box-shadow;
  z-index: 1;
}
.radio-provider-dot {
  display: block;
  position: absolute;
  left: 15px;
  top: 32px;
  width: 22px;
  height: 22px;
  circle {
    &:nth-child(2) {
      display: none;
    }
  }
}
.radio-provider-icon {
  position: absolute;
  top: 14px;
  right: 22px;
  width: 58px;
  height: 58px;
  border-radius: 50%;

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
      .radio-provider-dot {
        circle {
          &:nth-child(2) {
            display: block;
          }
        }
      }
    }
  }
}
</style>
