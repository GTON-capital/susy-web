<template>
  <form-group>
    <template v-slot:label><slot name="label"></slot></template>
    <button class="search-select btn" :class="searchSelectClass" @click="showModal">
      <span class="search-select-value">
        <span v-if="valueIcon" class="search-select-value-icon search-select-icon wrapper-icon-circle">
          <icon :image="valueIcon"></icon>
        </span>
        <span class="search-select-value-label">
          {{ valueLabel }}
        </span>
      </span>
      <icon v-show="hasVariety" class="search-select-chevron">
        <chevron-small-icon></chevron-small-icon>
      </icon>
    </button>
    <client-only>
      <modal :name="modalId">
        <modal-content :show-footer="false" class="search-select-model">
          <template v-slot:head>
            {{ modalHeading }}
          </template>
          <template v-slot:body>
            <div class="search-select-container">
              <simple-wrapper-slim>
                <search-input v-model="search">
                  <template v-slot:label>Search name</template>
                </search-input>
              </simple-wrapper-slim>
            </div>
            <div class="search-select-container">
              <div class="search-select-list">
                <a
                  v-for="(item, key) in filteredData"
                  :key="key"
                  href="javascript:void(0)"
                  :class="{
                    active: currentValue && item.id && currentValue.id === item.id,
                  }"
                  :data-id="item.id"
                  @click="selectValue(item)"
                >
                  <span v-if="item.icon" class="search-select-icon wrapper-icon-circle">
                    <icon :image="item.icon"></icon>
                  </span>
                  {{ item.label }}
                </a>
              </div>
            </div>
          </template>
        </modal-content>
      </modal>
    </client-only>
  </form-group>
</template>

<script>
import Vue from "vue"
import FormGroup from "~/components/FormGroup.vue"
import Icon from "~/components/Icon.vue"
import ModalContent from "~/components/ModalContent.vue"
import SearchInput from "~/components/SearchInput.vue"
import SimpleWrapperSlim from "~/components/SimpleWrapperSlim.vue"

export default Vue.extend({
  name: "SearchSelect",
  components: {
    FormGroup,
    Icon,
    ModalContent,
    SearchInput,
    SimpleWrapperSlim,
    chevronSmallIcon: () => import("assets/icons/chevron-small.svg?inline"),
  },
  props: {
    data: {
      type: Array,
      default: () => [],
      required: false,
    },
    value: {
      type: Object,
      default: () => undefined,
      required: false,
    },
    placeholder: {
      type: String,
      default: () => "Select ...",
      required: false,
    },
    modalHeading: {
      type: String,
      default: () => "Select ...",
      required: false,
    },
    readonly: {
      type: Boolean,
      default: () => false,
      required: false,
    },
  },
  data() {
    return {
      search: "",
      id: "",
      currentValue: undefined,
    }
  },
  computed: {
    hasVariety() {
      return this.data && this.data.length > 1
    },
    modalId() {
      return "search-select-modal-" + this.id
    },
    filteredData() {
      const search = this.search
      const data = this.data

      return search ? data.filter((value) => value.label.toLowerCase().includes(search.toLowerCase())) : data
    },
    searchSelectClass() {
      return {
        "search-select--with-icon": this.valueIcon,
        "search-select--readonly": this.readonly,
      }
    },
    valueIcon() {
      return this.currentValue && this.currentValue.icon
    },
    valueLabel() {
      return (this.currentValue && this.currentValue.label) || this.placeholder
    },
  },
  watch: {
    value(value) {
      this.currentValue = value
    },
  },
  created() {
    this.currentValue = this.value
    this.id = this.getUniqueId()
  },
  methods: {
    showModal() {
      if (!this.hasVariety) {
        return
      }

      !this.readonly && this.$modal.push(this.modalId)
    },
    getUniqueId() {
      return String(Math.floor(Math.random() * 10e10))
    },
    selectValue(item) {
      this.currentValue = item
      this.$modal.pop()
      this.$emit("input", item)
    },
  },
})
</script>

<style lang="scss">
@import "../assets/scss/import";
$search-select-chevron-height: 6px;
$search-select-chevron-width: 9px;
$search-select-icon-height: 32px;

.search-select {
  display: block;
  width: 100%;
  position: relative;
  padding-left: 10px;
  padding-right: 24px;
  font-weight: 400;
  white-space: normal;
  text-align: left;
  border-color: $input-border-color;
  background-color: $input-bg;
  color: $input-color;
  &:hover:not(:disabled) {
    border-color: $input-border-color;
    background-color: $input-bg;
    color: $input-color;
  }
  &.search-select--with-icon {
    padding-left: 48px;
  }
  .icon {
    margin-bottom: 0;
  }
  &.search-select--readonly {
    cursor: auto !important;
    border-color: $input-disabled-bg;
    background-color: $input-disabled-bg;
    color: $input-disabled-color;
    &:hover:not(:disabled) {
      border-color: $input-disabled-bg;
      background-color: $input-disabled-bg;
      color: $input-disabled-color;
    }
    .search-select-chevron {
      display: none;
    }
  }
}
.search-select-icon {
  box-shadow: $base-box-shadow;
  width: 100%;
  height: $search-select-icon-height;
  max-width: $search-select-icon-height;
  flex: 0 0 $search-select-icon-height;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    height: 32px;
    width: 32px;
    margin: 0;
  }
}
.search-select-value {
  display: block;
  width: 100%;
}
.search-select-value-icon {
  position: absolute;
  left: 10px;
  top: $input-height/2 - $search-select-icon-height/2;
}
.search-select-value-label {
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  min-width: 0;
  max-width: 100%;
  width: 100%;
}
.search-select-chevron {
  display: block;
  position: absolute;
  color: $search-select-chevron-color;
  top: $input-height/2 - $search-select-chevron-height/2;
  right: 14px;
  width: $search-select-chevron-width;
  height: $search-select-chevron-height;
}
.search-select-list {
  a {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 48px;
    font-weight: 400;
    padding-top: 3px;
    padding-bottom: 3px;
    text-decoration: none !important;
    &.active {
      color: $primary;
      font-weight: 700;
    }
    &:hover {
      background: $search-select-list-item-hover-background;
      color: $primary;
    }
  }
  .search-select-icon {
    margin-right: 8px;
    height: 42px;
    max-width: 42px;
    flex: 0 0 42px;
    box-shadow: none;
    .icon {
      width: 23px;
      height: 23px;
    }
  }
}
.search-select-container {
  margin-left: auto;
  margin-right: auto;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 350px;
  max-width: 480px;
}
</style>
