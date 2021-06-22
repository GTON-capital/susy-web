<template>
  <div class="radio-account" :class="{ 'radio-account--without-value': !value }">
    <template v-if="value">
      <input :id="id" :type="type" :name="name" :checked="checked" :value="value" class="hide radio-account-input" @change="$emit('change', walletData)" />
      <label :for="id" class="radio-account-label" :aria-label="wallet.label"></label>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="transparent" xmlns="http://www.w3.org/2000/svg" class="radio-account-dot">
        <circle cx="11" cy="11" r="10" fill="transparent" stroke="#00DD80" stroke-width="2" />
        <circle cx="11" cy="11" r="4" fill="#00DD80" />
      </svg>
    </template>
    <label :for="id" class="radio-account-icon wrapper-icon-circle">
      <icon :image="wallet.icon"></icon>
    </label>
    <label :for="id" class="radio-account-name">
      {{ wallet.label }}
    </label>
    <div class="radio-account-content">
      <template v-if="value">
        <div class="radio-account-content-label">{{ label }}</div>
        <label :for="id" class="radio-account-content-value">
          {{ value }}
        </label>
        <btn class="btn-circle btn-secondary-gradient radio-account-logout" @click="$emit('logout', walletData)">
          <icon>
            <logout-icon></logout-icon>
          </icon>
        </btn>
      </template>
      <template v-else>
        <btn class="btn-primary btn-block" @click="$emit('connect', walletData)">Connect new wallet</btn>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import Icon from "~/components/Icon.vue"
import Btn from "~/components/Btn.vue"

export default Vue.extend({
  name: "RadioAccount",
  components: {
    Icon,
    Btn,
    logoutIcon: () => import("assets/icons/logout.svg?inline"),
  },
  props: ["walletData"],
  computed: {
    wallet() {
      return this.walletData.wallet
    },
    value() {
      return this.walletData.value
    },
    label() {
      return this.walletData.label
    },
    name() {
      return this.walletData.name
    },
    checked() {
      return this.walletData.checked
    },
  },
  data: () => ({
    id: "",
    type: "radio",
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
@import "../assets/scss/import";
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
  circle {
    &:nth-child(2) {
      display: none;
    }
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
  box-shadow: $base-box-shadow;
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
  border: 2px solid;
  border-color: $base-border-color;
  box-shadow: $base-box-shadow;
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
.radio-account-content-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 240px;
}
.radio-account-input:checked {
  ~ {
    .radio-account-dot {
      circle {
        &:nth-child(2) {
          display: block;
        }
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
  .radio-account--without-value {
    .radio-account-content {
      padding-right: 30px;
    }
  }
}
</style>
