<template>
  <div class="transactions-icons">
    <div class="transactions-icons-left">
      <div class="transactions-icons-icon wrapper-icon-circle">
        <icon :image="left.icon"></icon>
      </div>
      <div>{{ left.label }}</div>
    </div>
    <div v-if="right" class="transactions-icons-arrow">
      <icon>
        <vs-icon></vs-icon>
      </icon>
    </div>
    <div v-if="right" class="transactions-icons-right">
      <div class="transactions-icons-icon wrapper-icon-circle">
        <icon :image="right.icon"></icon>
      </div>
      <div>{{ right.label }}</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'TransactionsIcons',
  components: {
    Icon,
    vsIcon: () => import('assets/icons/vs.svg?inline'),
  },
  props: {
    left: {
      type: Object,
      required: true,
    },
    right: {
      type: Object,
      default: null,
      required: false,
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
  color: $transactions-icons-arrow-color;
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
  box-shadow: $base-box-shadow;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  .icon {
    height: 32px;
    width: 32px;
    margin: 0;
  }
}
</style>
