<template>
  <div :class="className">
    <button class="modal-close" aria-label="Close Modal" @click="$modal.pop()">
      <icon>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2.5"
            width="38.85"
            height="3.525"
            rx="1.7625"
            transform="rotate(45 2.5 0)"
            fill="currentColor"
          />
          <rect
            y="27.5"
            width="38.85"
            height="3.525"
            rx="1.7625"
            transform="rotate(-45 0 27.5)"
            fill="currentColor"
          />
        </svg>
      </icon>
    </button>
    <div class="modal-head headings-font-family">
      <div class="modal-container">
        <slot name="head"></slot>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-container">
        <slot name="body"></slot>
      </div>
    </div>
    <div v-if="showFooter" class="modal-footer">
      <div class="modal-container">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'ModalContent',
  components: { Icon },
  props: {
    showFooter: {
      type: Boolean,
      default: () => true,
      required: false,
    },
    size: {
      type: String,
      default: () => '',
      required: false,
    },
  },
  computed: {
    className() {
      return {
        'modal-tiny': this.size === 'tiny',
        'modal-sm': this.size === 'sm',
        'modal-md': this.size === 'md',
        'modal-lg': this.size === 'lg',
      }
    },
  },
})
</script>
