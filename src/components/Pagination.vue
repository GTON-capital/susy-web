<template>
  <nav v-if="getCountPages > 1" class="pagination">
    <ul class="pagination-list">
      <li
        class="pagination-item pagination-arrow-prev"
        :class="{ 'pagination-item-disabled': !(page > 1) }"
      >
        <a
          href="javascript:void(0)"
          aria-label="Back"
          @click="setPage(page - 1)"
        >
          <icon>
            <back-icon></back-icon>
          </icon>
        </a>
      </li>
      <li v-for="(n, i) in getPages" :key="i" class="pagination-item">
        <a
          :class="{ active: page === n }"
          href="javascript:void(0)"
          @click="setPage(n)"
          >{{ n }}</a
        >
      </li>
      <li
        class="pagination-item pagination-arrow-next"
        :class="{ 'pagination-item-disabled': !(page < getCountPages) }"
      >
        <a
          href="javascript:void(0)"
          aria-label="Next"
          @click="setPage(page + 1)"
        >
          <icon>
            <forward-icon></forward-icon>
          </icon>
        </a>
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
    backIcon: () => import('assets/icons/back.svg?inline'),
    forwardIcon: () => import('assets/icons/forward.svg?inline'),
  },
  props: {
    countPages: {
      type: [Number, String],
      required: true,
    },
    value: {
      type: [Number, String],
      default: 1,
      required: false,
    },
  },
  data: () => ({
    page: 1,
  }),
  computed: {
    getCountPages() {
      return Number(this.countPages)
    },
    getPages() {
      const pages = []
      const countPages = this.getCountPages
      let start = this.page - 2
      if (start < 1) {
        start = 1
      }
      for (let i = start; pages.length < 5; i++) {
        if (i > countPages) {
          break
        }
        pages.push(i)
      }
      if (pages.length < 5) {
        for (let i = start - 1; pages.length < 5; i--) {
          if (i < 1) {
            break
          }
          pages.unshift(i)
        }
      }
      return pages
    },
  },
  watch: {
    value(n) {
      this.page = n
    },
  },
  created() {
    this.page = this.value
  },
  methods: {
    setPage(n) {
      if (n >= 1 && n <= this.getCountPages) {
        this.page = n
        this.$emit('input', n)
      }
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
      color: $pagination-item-color;
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
  a {
    color: $pagination-item-arrow-color !important;
    @media (hover: hover) {
      &:hover {
        color: $pagination-item-arrow-hover-color !important;
      }
    }
  }
  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
