<template>
  <div class="radio-account">
    <input
      :id="id"
      :type="type"
      :name="name"
      :checked="checked"
      :value="data && data.id"
      class="hide radio-account-input"
      @change="$emit('change', $event)"
    />
    <label :for="id" class="radio-account-label" aria-label="Ethereum"></label>
    <div class="radio-account-dot"></div>
    <label :for="id" class="radio-account-icon">
      <icon image="/img/icons/ethereum.svg"></icon>
    </label>
    <label :for="id" class="radio-account-name">
      Ethereum
    </label>
    <div class="radio-account-content">
      <div class="radio-account-content-label">Connected with Metamask</div>
      <label :for="id" class="radio-account-content-value">
        0x1015e2182E...6AD26FB9
      </label>
      <btn class="btn-circle btn-secondary-gradient radio-account-logout">
        <icon image="/img/icons/logout.svg"></icon>
      </btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '~/components/Icon.vue'
import Btn from '~/components/Btn.vue'

export default Vue.extend({
  name: 'RadioAccount',
  components: { Icon, Btn },
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
  data: () => ({
    id: '',
  }),
  created() {
    this.id = this.getUniqueId()
  },
  methods: {
    getUniqueId() {
      return String(Math.floor(Math.random() * 10e10))
    },
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';
// stylelint-disable selector-no-qualifying-type

.radio-account {
  position: relative;
  display: block;
  width: 100%;
  cursor: pointer;
  margin-bottom: 0;
  + .radio-account {
    margin-top: $form-group-margin-bottom-sm;
    @include media-breakpoint-up(sm) {
      margin-top: $form-group-margin-bottom;
    }
  }
  label {
    margin-bottom: 0;
  }
}
.radio-account-label {
  display: block;
  margin: 0;
  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.radio-account-dot {
  display: none;
  position: absolute;
  left: 0;
  top: 21px;
  width: 22px;
  height: 22px;
  &:before,
  &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  &:before {
    left: 0;
    top: 0;
    width: 22px;
    height: 22px;
    border: 2px solid $success;
  }
  &:after {
    left: 7px;
    top: 7px;
    width: 8px;
    height: 8px;
    background-color: $success;
    display: none;
  }
}
.radio-account-icon {
  position: absolute;
  top: 12px;
  left: 14px;
  width: 32px;
  height: 32px;
  z-index: 10;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #eaf1f3;
  box-shadow: 0px 1px 25px #e2f1f6;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    width: 22px;
    height: 22px;
  }
}
.radio-account-name {
  position: absolute;
  top: 19px;
  left: 52px;
  z-index: 9;
}
.radio-account-content {
  background: #ffffff;
  border: 2px solid #eaf1f3;
  box-shadow: 0px 1px 25px #e2f1f6;
  border-radius: 8px;
  padding: 50px 18px 15px 18px;
  width: 100%;
  margin-left: auto;
}
.radio-account-content-label {
  font-size: 13px;
  color: $secondary;
  margin-bottom: 7px;
  position: relative;
  z-index: 7;
}
.radio-account-content-value {
  color: $primary;
  font-weight: 600;
  position: relative;
  z-index: 8;
}
.radio-account-logout {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 6;
  .icon {
    left: calc(50% + 1px);
  }
  @include media-breakpoint-down(sm) {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    .icon {
      width: 12px;
      height: 12px;
    }
  }
}
.radio-account-input:checked {
  ~ {
    .radio-account-dot {
      &:after {
        display: block;
      }
    }
    .radio-account-content {
      border-color: $success;
    }
  }
}
@include media-breakpoint-up(md) {
  .radio-account-content {
    width: calc(100% - 112px);
    padding: 22px 80px 22px 30px;
  }
  .radio-account-content {
    border-width: 1px;
  }
  .radio-account-icon {
    top: 16px;
    left: 29px;
  }
  .radio-account-name {
    top: 49px;
    left: 50px;
    transform: translateX(-50%);
  }
  .radio-account-logout {
    right: 30px;
    top: 22px;
  }
  .radio-account-dot {
    display: block;
  }
}
</style>
