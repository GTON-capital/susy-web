<template>
  <nav class="nav" :class="{ active: isOpenNav }">
    <div class="navbar-backdrop" @click="isOpenNavToggle"></div>
    <div class="container nav-container">
      <div class="nav-content">
        <nuxt-link to="/" class="nav-logo responsive">
          <img
            class="responsive-item"
            :src="`/img/${theme}/logo.svg`"
            alt="Logo"
          />
        </nuxt-link>
        <div
          class="nav-header"
          :class="{ 'nav-header-mobile': isHideMobileTitle }"
        >
          <template v-if="$route.name === 'intrachain'">
            Seamless Intrachain <br />Swaps
          </template>
          <template v-else> Seamless <br />Crosschain Swaps </template>
        </div>
        <div class="nav-menu-wrapper">
          <button
            class="nav-burger"
            :class="{ active: isOpenNav }"
            aria-label="Menu"
            @click="isOpenNavToggle"
          >
            <i></i><i></i><i></i>
          </button>
          <div class="nav-menu">
            <nuxt-link class="nav-menu-item link-invert" to="/">FAQ</nuxt-link>
            <nuxt-link class="nav-menu-item link-invert" to="/">Docs</nuxt-link>
            <footer-block :is-disabled-cookies-box="true"></footer-block>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import footerBlock from '~/components/Footer.vue'

export default Vue.extend({
  name: 'Navbar',
  components: {
    footerBlock,
  },
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
    isOpenNav() {
      return this.$store.getters['app/isOpenNav']
    },
    navbarTitle() {
      return this.$store.getters['app/navbarTitle']
    },
    isHideMobileTitle() {
      return this.$store.getters['app/isHideMobileTitle']
    },
  },
  methods: {
    isOpenNavToggle() {
      this.$store.dispatch('app/isOpenNavToggle')
    },
  },
})
</script>

<style lang="scss">
.nav {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  @include media-breakpoint-up(md) {
    height: 108px;
    margin-bottom: 30px;
  }
  hr {
    display: none;
    margin-top: 12px;
  }
}
.nav-container {
  padding-top: 20px;
  padding-bottom: 22px;
  z-index: $zindex-modal-backdrop - 10;
  @include media-breakpoint-up(md) {
    padding-bottom: 0;
  }
}
.nav-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.nav-logo {
  display: block;
  flex: 0 0 $logo-width;
  width: $logo-width;
  max-width: 100%; // Reset earlier grid tiers
  @include media-breakpoint-up(md) {
    flex: 0 0 $logo-width-md;
    width: $logo-width-md;
  }
  &:before {
    content: '';
    display: block;
    padding-top: $logo-height;
    @include media-breakpoint-up(md) {
      padding-top: $logo-height-md;
    }
  }
}
.nav-header {
  line-height: 1;
  font-size: calc(32px * #{$nav-header-fz-scale});
  height: 1.1em;
  color: $nav-header-color;
  font-family: $nav-header-font-family;
  background: -webkit-linear-gradient(#ff0097, #688487);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @include media-breakpoint-up(md) {
    font-size: calc(38px * #{$nav-header-fz-scale});
  }
  @include media-breakpoint-up(lg) {
    font-size: calc(44px * #{$nav-header-fz-scale});
  }
  @include media-breakpoint-down(sm) {
    order: 5;
    @include make-col(1, 1);
    @include make-col-ready(0px);
    padding-top: 10px;
    height: calc(1.1em + 10px);
  }
  br {
    display: none;
  }
}
.nav-burger {
  position: relative;
  width: 82px;
  height: 42px;
  background: $body-bg;
  border: 1px solid;
  border-color: $nav-burger-border-color;
  box-shadow: $base-box-shadow;
  border-radius: 8px;
  outline: none !important;
  i {
    position: absolute;
    display: block;
    height: 2px;
    left: 20px;
    top: 13px;
    background-color: $nav-burger-lines-background-color;
    border-radius: 4px;
    transform: scaleY(0.5);
    transition: 0.3s;
    pointer-events: none;
    transform-origin: left center;
    &:nth-child(1) {
      width: 39px;
    }
    &:nth-child(2) {
      width: 27px;
      top: 20px;
    }
    &:nth-child(3) {
      width: 17px;
      top: 27px;
    }
  }
}
.nav-menu-wrapper {
  display: flex;
  position: relative;
  @include media-breakpoint-up(sm) {
    .footer {
      display: none;
    }
  }
}
.nav-menu {
  background-color: $body-bg;
  border: 1px solid;
  border-color: $base-border-color;
  box-shadow: $base-box-shadow;
  border-radius: 8px;
  width: 158px;
  padding: 11px 0;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  pointer-events: none;
  opacity: 0;
  z-index: $zindex-modal-backdrop - 5;
  transition: 0.2s;
  @include media-breakpoint-up(sm) {
    transform: translateY(20px);
    transition: 0.3s ease-in-out;
  }
}
.nav-menu-item {
  display: block;
  padding: 7px 27px;
}
.navbar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $zindex-modal-backdrop - 20;
  height: 100vh;
  background: $navbar-backdrop-background;
  backdrop-filter: blur(24.4645px);
  transition: 0.2s opacity;
  width: 0;
  pointer-events: none;
  opacity: 0;
}
.nav {
  &.active {
    .nav-menu {
      transform: translateY(0px);
      pointer-events: auto;
      opacity: 1;
    }
    .nav-burger {
      i {
        width: 22px;
        left: 50%;
        top: 50%;
        &:nth-child(1) {
          transform: rotate(-50deg) scaleY(0.5) translate(-50%, -50%);
        }
        &:nth-child(2) {
          transform: rotate(50deg) scaleY(0.5) translate(-50%, -50%);
        }
        &:nth-child(3) {
          opacity: 0;
        }
      }
    }
  }
}
@include media-breakpoint-down(sm) {
  .nav {
    hr {
      display: block;
    }
  }
  .nav-header-mobile {
    display: none;
  }
}
@include media-breakpoint-down(xs) {
  .nav-menu {
    top: calc(100% + 14px);
    border-radius: 0;
    width: 100vw;
    box-shadow: none;
    border: none;
    border-top: 1px solid rgba(50, 80, 80, 0.31);
    right: -#{$grid-gutter-width / 2};
  }
  .nav {
    &.active {
      .navbar-backdrop {
        width: 100vw;
        pointer-events: auto;
        opacity: 1;
      }
      .nav-container {
        background-color: $body-bg;
      }
    }
  }
}
@media (max-width: 400px) {
  .nav-header {
    height: calc(2.1em + 10px);
    br {
      display: block;
    }
  }
}
</style>
