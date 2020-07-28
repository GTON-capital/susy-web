<template>
  <nav v-if="pagesCount > 1" class="pagination">
    <ul class="pagination-list">
      <li
        class="pagination-item pagination-arrow-prev"
        :class="{ 'pagination-item-disabled': !(page > 1) }"
      >
        <a
          href="javascript:void(0)"
          aria-label="Back"
          @click="setPage(page - 1)"
          ><icon image="/img/icons/back.svg"></icon
        ></a>
      </li>
      <li v-for="(n, i) in pagesCount" :key="i" class="pagination-item">
        <a
          :class="{ active: page === n }"
          href="javascript:void(0)"
          @click="setPage(n)"
          >{{ n }}</a
        >
      </li>
      <li
        class="pagination-item pagination-arrow-next"
        :class="{ 'pagination-item-disabled': !(page < pagesCount) }"
      >
        <a
          href="javascript:void(0)"
          aria-label="Next"
          @click="setPage(page + 1)"
          ><icon image="/img/icons/forward.svg"></icon
        ></a>
      </li>
    </ul>
  </nav>
</template>

<script>
import Vue from 'vue'
import Icon from '~/components/Icon'

export default Vue.extend({
  name: 'Pagination',
  components: {
    Icon,
  },
  data: () => ({
    page: 2,
    pagesCount: 5,
  }),
  methods: {
    setPage(n) {
      this.page = n
    },
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.pagination-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
}
.pagination-item {
  display: block;
  margin: 2px;
  a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    text-decoration: none !important;
    &:not(.active):not(:hover) {
      color: $secondary;
    }
    &:hover {
      font-weight: 600;
    }
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 4px;
      width: 16px;
      height: 2px;
      background-color: transparent;
    }
    &.active {
      font-weight: 600;
      &:before {
        background-color: $primary;
      }
    }
  }
}
.pagination-arrow-prev,
.pagination-arrow-next {
  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
