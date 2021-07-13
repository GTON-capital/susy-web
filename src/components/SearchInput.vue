<template>
  <form-group style="margin-bottom: 0;">
    <template v-slot:label><slot name="label"></slot></template>
    <label class="search-input">
      <button type="submit" class="search-input-submit">
        <icon>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.8516 11.4258C22.8516 5.12561 17.726 0 11.4258 0C5.12561 0 0 5.12561 0 11.4258C0 17.726 5.12561 22.8516 11.4258 22.8516C13.943 22.8516 16.2722 22.0327 18.1624 20.6483L27.5141 30L30 27.514L20.6483 18.1624C22.0327 16.2722 22.8516 13.943 22.8516 11.4258ZM21.0954 11.4484C21.0954 16.7676 16.7679 21.095 11.4487 21.095C6.12958 21.095 1.80209 16.7676 1.80209 11.4484C1.80209 6.12924 6.12958 1.80176 11.4487 1.80176C16.7679 1.80176 21.0954 6.12924 21.0954 11.4484Z"
              fill="currentColor"
            />
          </svg>
        </icon>
      </button>
      <button v-if="value" class="search-input-clear" aria-label="Clear Input" @click="$emit('input', '')">
        <icon>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" width="38.85" height="3.525" rx="1.7625" transform="rotate(45 2.5 0)" fill="currentColor" />
            <rect y="27.5" width="38.85" height="3.525" rx="1.7625" transform="rotate(-45 0 27.5)" fill="currentColor" />
          </svg>
        </icon>
      </button>
      <input type="search" class="form-control" :value="value" :placeholder="placeholder" @input="$emit('input', $event.target.value)" />
    </label>
  </form-group>
</template>

<script>
import Vue from "vue"
import FormGroup from "~/components/FormGroup.vue"
import Icon from "~/components/Icon.vue"

export default Vue.extend({
  name: "SearchInput",
  components: { FormGroup, Icon },
  props: {
    value: {
      type: String,
      default: () => "",
      required: false,
    },
    placeholder: {
      type: String,
      default: () => "",
      required: false,
    },
  },
})
</script>

<style lang="scss">
$search-input-height: 35px;

.search-input {
  display: block;
  position: relative;
  margin-bottom: 0;
  .icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
  }
  .form-control {
    padding-left: $input-height;
  }
}
.search-input-submit {
  position: absolute;
  left: 0;
  top: 0;
  background: transparent;
  border: none;
  outline: none !important;
  width: 34px;
  height: 100%;
  color: $search-input-submit-color;
  &:hover {
    color: $search-input-submit-color;
  }
}
.search-input-clear {
  position: absolute;
  right: 0;
  top: 0;
  width: $input-height;
  height: $input-height;
  border: none;
  background: transparent;
  outline: none !important;
  color: $secondary;
  &:hover {
    color: $primary;
  }
  .icon {
    position: absolute;
    width: 13px;
    height: 13px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
