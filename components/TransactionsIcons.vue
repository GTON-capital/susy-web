<template>
  <div class="transactions-icons">
    <div class="transactions-icons-left">
      <div class="transactions-icons-icon">
        <icon :image="left.icon"></icon>
      </div>
      <div>{{ left.label }}</div>
    </div>
    <div class="transactions-icons-arrow">
      <icon image="/img/icons/vs-secondary.svg"></icon>
    </div>
    <div class="transactions-icons-right">
      <div class="transactions-icons-icon">
        <icon :image="right.icon"></icon>
      </div>
      <div>{{ right.label }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'TransactionsIcons',
  components: { Icon },
  props: {
    left: {
      type: Object,
      required: true,
    },
    right: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.transactions-icons {
  position: relative;
  max-width: 250px;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2px;
}
.transactions-icons-left,
.transactions-icons-right {
  flex-basis: 0;
  flex-grow: 1;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.transactions-icons-arrow {
  width: 100%;
  flex: 0 0 50px;
  max-width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    width: 20px;
    height: 20px;
  }
}
.transactions-icons-icon {
  background: #ffffff;
  border: 1px solid;
  border-color: $base-border-color;
  box-shadow: $base-box-shadow;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  .icon {
    height: 20px;
    width: 20px;
    margin: 0;
  }
}
</style>
