<template>
  <div class="form-group">
    <label v-if="$slots.label" :for="id" class="form-control-label"> <slot name="label"></slot></label>
    <label v-if="$slots.error" :for="id" class="form-control-label error"> <slot name="error"></slot></label>
    <div v-if="$slots.prepend" class="form-control-prepend">
      <slot name="prepend"></slot>
    </div>
    <div v-if="$slots.append" class="form-control-append">
      <slot name="append"></slot>
    </div>
    <div class="form-control-content">
      <div v-if="icon" class="form-control-icon wrapper-icon-circle">
        <icon :image="icon"></icon>
      </div>
      <input :id="id" :type="type" :value="value" :readonly="readonly" class="form-control" :class="inputClass" @input="$emit('input', $event.target.value)" />
    </div>
    <div v-if="$slots.text" class="form-text"><slot name="text"></slot></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Icon from "~/components/Icon.vue"

export default Vue.extend({
  name: "FormInput",
  components: {
    Icon,
  },
  props: {
    type: {
      type: String,
      default: () => "text",
      required: false,
    },
    icon: {
      type: String,
      default: () => "",
      required: false,
    },
    readonly: {
      type: Boolean,
      default: () => false,
      required: false,
    },
    value: {
      type: [String, Number],
      default: () => "",
      required: false,
    },
  },
  data: () => ({
    id: "",
  }),
  created() {
    this.id = this.getUniqueId()
  },
  computed: {
    inputClass() {
      return this.$slots.error && "error"
    },
  },
  methods: {
    getUniqueId() {
      return String(Math.floor(Math.random() * 10e10))
    },
  },
})
</script>

<style lang="scss" scoped>
input.error {
  border-color: red !important;
}
label.error {
  color: red;
  margin: 0;
  text-align: right;
  margin-top: -27px;
  font-weight: 400;
}
</style>
