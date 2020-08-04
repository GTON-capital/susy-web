<template>
  <footer class="footer">
    <hr />
    <div class="container">
      <div class="footer-nav">
        <hr />
        <div class="footer-nav-logo-wrapper">
          <nuxt-link
            to="/"
            class="footer-nav-logo responsive responsive-bsizer"
          >
            <img
              class="responsive-item"
              src="/img/gravity/logo.svg"
              alt="Logo"
            />
          </nuxt-link>
        </div>
        <div class="footer-nav-item">
          <a class="link-invert" href="/">Docs</a>
        </div>
        <div class="footer-nav-item">
          <a class="link-invert" href="/">Whitepaper</a>
        </div>
        <div class="footer-nav-item">
          <a class="link-invert" href="/">FAQ</a>
        </div>
        <div class="footer-nav-item">
          <a class="link-invert" href="/">Brand Assets</a>
        </div>
        <div class="footer-nav-item"><a href="/">Privacy policy</a></div>
        <div class="footer-nav-item"><a href="/">Terms & Conditions</a></div>
        <div class="footer-nav-item footer-contacts-email">
          <a href="mailto:oracle@gravity.tech" class="text-primary">
            oracle@gravity.tech
          </a>
        </div>
      </div>
    </div>
    <hr />
    <div class="container">
      <div class="footer-socials">
        <div class="footer-copyright footer-copyright-lg">
          &copy; {{ new Date().getFullYear() }} Gravity Protocol.
          <span class="footer-copyright-desc"
            >Oracles and Cross-chain Communication Network</span
          >
        </div>
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
      <div class="footer-contacts">
        <btn v-if="false" tag="a" href="/" class="footer-gravity-btn">
          <icon>
            <ventuary-lab-icon></ventuary-lab-icon>
          </icon>
        </btn>
        <a
          class="text-primary footer-contacts-email"
          href="mailto:oracle@gravity.tech"
        >
          oracle@gravity.tech
        </a>
      </div>
      <div class="footer-copyright footer-copyright-xs">
        &copy; {{ new Date().getFullYear() }} Gravity Protocol.
        <span class="footer-copyright-desc"
          >Oracles and Cross-chain Communication Network</span
        >
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
            <btn class="btn-primary footer-cookies-btn" @click="hideCookiesBox"
              >I agree</btn
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue'
import Btn from '~/components/Btn.vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'GravityFooter',
  components: {
    Btn,
    Icon,
    ventuaryLabIcon: () => import('assets/icons/ventuary-lab.svg?inline'),
    socialsTwitterIcon: () => import('assets/icons/socials/twitter.svg?inline'),
    socialsMediumIcon: () => import('assets/icons/socials/medium.svg?inline'),
    socialsTelegramIcon: () =>
      import('assets/icons/socials/telegram.svg?inline'),
    socialsFacebookIcon: () =>
      import('assets/icons/socials/facebook.svg?inline'),
    socialsLinkedInIcon: () =>
      import('assets/icons/socials/linked-in.svg?inline'),
    socialsDiscordIcon: () => import('assets/icons/socials/discord.svg?inline'),
    socialsRedditIcon: () => import('assets/icons/socials/reddit.svg?inline'),
    socialsGithubIcon: () => import('assets/icons/socials/github.svg?inline'),
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
        icon: 'facebook',
        link: '/',
      },
      {
        icon: 'medium',
        link: '/',
      },
      {
        icon: 'twitter',
        link: '/',
      },
      {
        icon: 'linked-in',
        link: '/',
      },
      {
        icon: 'telegram',
        link: '/',
      },
      {
        icon: 'discord',
        link: '/',
      },
      {
        icon: 'reddit',
        link: '/',
      },
      {
        icon: 'github',
        link: '/',
      },
    ],
    heightCookiesBox: 100,
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
        height: this.getIsCookiesBox
          ? this.heightCookiesBox + 30 + 'px'
          : '0px',
        'min-height': this.getIsCookiesBox ? '100px' : '0px',
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
  font-weight: 300;
  hr {
    display: none;
    @include media-breakpoint-up(md) {
      display: block;
    }
  }
}
.footer-nav {
  padding-top: 25px;
  display: block;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  color: $text-muted;
  margin-left: -15px;
  margin-right: -15px;
  @include media-breakpoint-up(md) {
    min-height: 118px;
    display: flex;
    padding-bottom: 25px;
  }
  hr {
    position: relative;
    top: -25px;
    display: block;
    @include media-breakpoint-up(md) {
      display: none;
    }
  }
  .footer-contacts-email {
    display: none;
    @include media-breakpoint-up(lg) {
      display: inline-block;
    }
  }
}
.footer-contacts-email {
  @include media-breakpoint-down(xs) {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.footer-nav-item {
  display: none;
  a {
    display: block;
    padding: 15px;
  }
  @include media-breakpoint-up(md) {
    display: inline-block;
  }
}
.footer-nav-logo-wrapper {
  padding-left: 15px;
  padding-right: 15px;
  flex: 0 0 100%;
  width: 100%;
  @include media-breakpoint-up(xl) {
    flex: 0 0 auto;
    width: auto;
  }
}
.footer-nav-logo {
  display: block;
  flex: 0 0 $logo-width;
  width: $logo-width;
  max-width: 100%; // Reset earlier grid tiers
  margin-bottom: 15px;
  &:before {
    padding-top: $logo-height;
  }
  @include media-breakpoint-up(md) {
    margin-bottom: 21px;
  }
  @include media-breakpoint-up(xl) {
    margin-bottom: 0;
  }
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
  background: $body-bg;
  border: 1px solid #2e3148;
  min-height: 70px;
  padding: 15px;
  @include media-breakpoint-up(sm) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.footer-socials,
.footer-contacts,
.footer-social {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.footer-socials,
.footer-contacts {
  @include media-breakpoint-up(md) {
    padding-bottom: 34px;
  }
  @include media-breakpoint-up(md) {
    padding-bottom: 43px;
  }
}
.footer-socials {
  margin-left: -10px;
  margin-right: -10px;
  @include media-breakpoint-up(md) {
    padding-top: 47px;
    margin-left: 0;
    margin-right: 0;
  }
  .footer-gravity-btn {
    display: none;
    @include media-breakpoint-up(lg) {
      display: inline-block;
    }
  }
}
.footer-social {
  justify-content: center;
  height: 42px;
  width: 42px;
  min-width: 42px;
  opacity: 0.65;
  transition: $btn-transition;
  @include media-breakpoint-up(md) {
    height: 36px;
    width: 36px;
    min-width: 36px;
  }
  @media (max-width: 400px) {
    height: 36px;
    width: 36px;
    min-width: 36px;
  }
  i {
    height: 30px;
    width: 30px;
  }
  + .footer-social {
    @include media-breakpoint-up(md) {
      margin-left: auto;
    }
  }
  &:hover {
    opacity: 1;
  }
}
.footer-gravity-btn {
  margin-right: 66px;
  padding-left: 17px;
  padding-right: 17px;
  i {
    top: 5px;
    width: 129px;
    height: 17px;
  }
  b {
    margin-top: -6px;
    margin-bottom: -6px;
  }
}
.footer-contacts {
  justify-content: space-between;
  margin-top: 14px;
  @include media-breakpoint-up(lg) {
    display: none;
  }
  @include media-breakpoint-up(md) {
    margin-top: 0;
  }
  .footer-contacts-email {
    @include media-breakpoint-down(xs) {
      color: #ffffff !important;
      font-weight: 200;
      font-size: 16px;
    }
  }
  .footer-contacts-email,
  .footer-gravity-btn {
    margin-bottom: 14px;
    @include media-breakpoint-up(md) {
      margin-bottom: 0;
    }
  }
}
.footer-copyright {
  font-weight: 300;
  font-size: 13px;
  line-height: 16px;
  color: $text-muted;
  margin-right: 48px;
}
.footer-copyright-lg {
  display: none;
  @include media-breakpoint-up(lg) {
    display: block;
  }
  .footer-copyright-desc {
    display: inline;
  }
}
.footer-copyright-xs {
  display: block;
  padding-bottom: 24px;
  @include media-breakpoint-up(lg) {
    display: none;
  }
  @include media-breakpoint-down(xs) {
    font-weight: 200;
  }
  @include media-breakpoint-up(sm) {
    padding-bottom: 38px;
  }
  .footer-copyright-desc {
    display: none;
    @include media-breakpoint-up(sm) {
      display: inline;
    }
  }
}
.footer-cookies-btn {
  margin-top: 19px;
  @include media-breakpoint-up(sm) {
    margin-top: 0;
    margin-left: 33px;
  }
  --primary: $text-muted;
}
</style>
