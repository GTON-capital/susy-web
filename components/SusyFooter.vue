<template>
  <footer class="footer">
    <div class="container footer-nav">
      <div class="footer-row">
        <div class="footer-gravity">
          <btn class="footer-gravity-btn" tag="a" to="/">
            <icon>
              <gravity-icon></gravity-icon>
            </icon>
          </btn>
        </div>
        <div class="footer-copyright headings-font-family">
          &copy; {{ new Date().getFullYear() }} Gravity Protocol.
        </div>
        <div class="footer-socials">
          <a
            v-for="(social, key) in socials"
            :key="key"
            class="footer-social"
            :href="social.link"
            target="_blank"
          >
            <icon>
              <component :is="'socials-' + social.icon + '-icon'"></component>
            </icon>
          </a>
        </div>
        <div class="footer-link headings-font-family">
          <a href="/">Privacy Policy</a>
        </div>
        <div class="footer-link headings-font-family">
          <a href="/">Terms of Service</a>
        </div>
        <div class="footer-link headings-font-family">
          <a class="text-primary" href="mailto:info@susy.one">info@susy.one</a>
        </div>
      </div>
    </div>
    <div
      v-if="!isDisabledCookiesBox"
      class="footer-cookies"
      :style="getCookiesStyle"
    >
      <div class="footer-cookies-wrapper" :style="getWrapperCookiesStyle">
        <div class="container">
          <div ref="cookiesBox" class="footer-cookies-box">
            <div>
              We use cookies on our website. By continuing to use the site, or
              by clicking “I&nbsp;agree”, you consent to the use of cookies. For
              more info click here.
            </div>
            <btn class="btn-primary footer-cookies-btn" @click="hideCookiesBox">
              I agree
            </btn>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue'
import Icon from '~/components/Icon.vue'
import Btn from '~/components/Btn.vue'


export default Vue.extend({
  name: 'SusyFooter',
  components: {
    Btn,
    Icon,
    gravityIcon: () => import('assets/icons/gravity.svg?inline'),
    socialsTwitterIcon: () => import('assets/icons/socials/twitter.svg?inline'),
    socialsMediumIcon: () => import('assets/icons/socials/medium.svg?inline'),
    socialsTelegramIcon: () =>
      import('assets/icons/socials/telegram.svg?inline'),
    socialsFacebookIcon: () =>
      import('assets/icons/socials/facebook.svg?inline'),
  },
  props: {
    isDisabledCookiesBox: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data: () => ({
    socials: [
      {
        icon: 'twitter',
        link: '/',
      },
      {
        icon: 'medium',
        link: '/',
      },
      {
        icon: 'telegram',
        link: '/',
      },
      {
        icon: 'facebook',
        link: '/',
      },
    ],
    heightCookiesBox: 74,
    isCookiesBox: false,
    instanceHeightCookiesBox: undefined,
  }),
  computed: {
    getIsCookiesBox() {
      return this.isCookiesBox && !this.isDisabledCookiesBox
    },
    getWrapperCookiesStyle() {
      return {
        bottom: this.getIsCookiesBox ? '30px' : '-100%',
      }
    },
    getCookiesStyle() {
      return {
        height: this.getIsCookiesBox ? this.heightCookiesBox + 'px' : '0px',
        'min-height': this.getIsCookiesBox ? '74px' : '0px',
      }
    },
  },
  mounted() {
    if (!this.isDisabledCookiesBox) {
      setTimeout(() => {
        this.isCookiesBox = !localStorage.getItem('IS_AGREE_COOKIES')
        this.calcHeightCookiesBox()
        this.bindHeightCookiesBox()
      }, 2000)
    }
  },
  beforeDestroy() {
    this.unbindHeightCookiesBox()
  },
  methods: {
    hideCookiesBox() {
      this.isCookiesBox = false
      localStorage.setItem('IS_AGREE_COOKIES', '1')
      this.unbindHeightCookiesBox()
    },
    bindHeightCookiesBox() {
      if (this.getIsCookiesBox && typeof window !== 'undefined') {
        window.addEventListener('resize', this.calcHeightCookiesBox)
      }
    },
    unbindHeightCookiesBox() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.calcHeightCookiesBox)
      }
    },
    calcHeightCookiesBox() {
      if (this.getIsCookiesBox) {
        clearTimeout(this.instanceHeightCookiesBox)
        // @ts-ignore: Type 'Timeout' is not assignable to type 'undefined'.
        this.instanceHeightCookiesBox = setTimeout(() => {
          if (this.$refs.cookiesBox) {
            // @ts-ignore:  Property 'getBoundingClientRect' does not exist on type 'Element | Element[] | Vue | Vue[]'
            this.heightCookiesBox = this.$refs.cookiesBox.getBoundingClientRect().height
          }
        }, 500)
      }
    },
  },
})
</script>

<style lang="scss">
.theme-susy {
  .footer-cookies {
    transition: height 0.5s ease;
  }
  .footer {
    padding-top: 42px;
    padding-bottom: 30px;
    @include media-breakpoint-down(xs) {
      padding-top: 14px;
      padding-bottom: 16px;
    }
  }
  .footer-nav {
    margin-bottom: 20px;
  }

  .footer-cookies-wrapper {
    position: fixed;
    bottom: 30px;
    left: 0;
    width: 100%;
    z-index: 10;
    transition: bottom 0.5s ease;
  }
  .footer-cookies-box {
    font-weight: 400;
    border: 1px solid;
    background-color: $body-bg;
    border-color: $primary;
    min-height: 70px;
    padding: 15px;
    @include media-breakpoint-up(sm) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .footer-cookies-btn {
    margin-top: 19px;
    @include media-breakpoint-up(sm) {
      margin-top: 0;
      margin-left: 33px;
    }
  }
  .footer-gravity-btn {
    padding-left: 14px;
    padding-right: 14px;
    i {
      width: 195px;
      height: 29px;
    }
    b {
      margin-top: -6px;
      margin-bottom: -6px;
    }
    @include media-breakpoint-down(xs) {
      display: block;
      width: 100%;
    }
  }
  .footer-row,
  .footer-gravity,
  .footer-copyright,
  .footer-socials {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  .footer-gravity,
  .footer-copyright,
  .footer-socials,
  .footer-link {
    @include make-col-ready(0);
    @include make-col-auto();
  }
  .footer-gravity {
  }
  .footer-copyright {
    justify-content: center;
    @include media-breakpoint-down(xs) {
      @include make-col(1, 1);
      order: 9;
    }
  }
  .footer-socials {
    justify-content: space-between;
    flex: 0 0 200px;
    max-width: 200px;
    @include media-breakpoint-down(xs) {
      @include make-col(1, 1);
      margin-bottom: 10px;
      justify-content: center;
    }
  }
  .footer-link {
    @include media-breakpoint-down(xs) {
      margin-bottom: 18px;
    }
  }
  .footer-social {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    min-width: 42px;
    color: $secondary;
    transform-origin: center;
    transition: 0.2s;
    &:hover {
      color: $secondary;
      transform: scale(1.1);
    }
    .icon {
      height: 30px;
      width: 30px;
    }
    @include media-breakpoint-down(xs) {
      margin: 0 20px;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .footer-gravity {
    @include media-breakpoint-down(xs) {
      margin-bottom: 10px;
      @include make-col(1, 1);
      justify-content: center;
    }
    @include media-breakpoint-down(sm) {
      margin-bottom: 10px;
    }
    @include media-breakpoint-only(md) {
      order: 9;
      @include make-col(1, 1);
      justify-content: center;
      margin-top: 30px;
    }
  }
  .footer-link {
  }
}
</style>
