<template>
  <component :is="tag" class="btn" :to="to" @click="$emit('click', $event)">
    <b><slot></slot></b>
  </component>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Btn',
  props: {
    tag: {
      type: String,
      default: () => 'button',
      required: false,
    },
    to: {
      type: String,
      default: () => '',
      required: false,
    },
  },
})
</script>
