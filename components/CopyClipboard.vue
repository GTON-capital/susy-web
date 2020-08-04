<template>
  <div class="copy-clipboard">
    <icon
      v-clipboard="() => value"
      v-clipboard:success="clipboardSuccessHandler"
    >
      <copy-icon></copy-icon>
    </icon>
    <div
      role="tooltip"
      class="tooltip fade bs-tooltip-top"
      :class="{ show: isCopied }"
    >
      <div class="arrow"></div>
      <div class="tooltip-inner">
        Copied!
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'CopyClipboard',
  components: {
    Icon,
    copyIcon: () => import('assets/icons/copy.svg?inline'),
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isCopied: false,
  }),
  methods: {
    clipboardSuccessHandler() {
      this.isCopied = true
      setTimeout(() => {
        if (this) {
          this.isCopied = false
        }
      }, 2000)
    },
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.copy-clipboard {
  display: inline-block;
  position: relative;
  .icon {
    margin-bottom: -0.3em;
    cursor: pointer;
    pointer-events: auto;
  }
  .tooltip {
    pointer-events: none;
    position: absolute;
    left: 50%;
    bottom: calc(100% + 5px);
    transform: translateX(-50%);
    font-weight: $card-header-font-weight;
    transition: 0.3s;
    .arrow {
      left: 50%;
      transform: translateX(-50%);
      &:before {
        border-top-color: $primary;
      }
    }
    .tooltip-inner {
      background-color: $primary;
    }
  }
}
</style>
