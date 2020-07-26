<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-row">
        <div class="footer-gravity">
          <btn class="footer-gravity-btn" tag="a" to="/">
            <icon image="/img/icons/gravity.svg"></icon>
          </btn>
        </div>
        <div class="footer-copyright font-cormorant">
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
            <b
              ><icon :image="`/img/icons/socials/${social.icon}.svg`"></icon
            ></b>
          </a>
        </div>
        <div class="footer-link"><a href="/">Privacy Policy</a></div>
        <div class="footer-link"><a href="/">Terms of Service</a></div>
        <div class="footer-link">
          <a class="text-primary" href="mailto:info@susy.one">info@susy.one</a>
        </div>
      </div>
    </div>
    <div class="footer-cookies" :style="getCookiesStyle">
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

<script lang="ts">
import Vue from 'vue'
import Icon from '~/components/Icon.vue'
import Btn from '~/components/Btn.vue'

export default Vue.extend({
  components: { Btn, Icon },
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
    heightCookiesBox: 100,
    isDisabledCookiesBox: false,
    isCookiesBox: false,
    instanceHeightCookiesBox: undefined,
  }),
  computed: {
    getWrapperCookiesStyle() {
      return {
        bottom: this.isCookiesBox ? '30px' : '-100%',
      }
    },
    getCookiesStyle() {
      return {
        height: this.isCookiesBox ? this.heightCookiesBox + 30 + 'px' : '0px',
        'min-height': this.isCookiesBox ? '100px' : '0px',
      }
    },
  },
  mounted() {
    if (!this.isDisabledCookiesBox) {
      this.calcHeightCookiesBox()
      this.bindHeightCookiesBox()
      setTimeout(() => {
        this.isCookiesBox = !localStorage.getItem('IS_AGREE_COOKIES')
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
      if (this.isCookiesBox && typeof window !== 'undefined') {
        window.addEventListener('resize', this.calcHeightCookiesBox)
      }
    },
    unbindHeightCookiesBox() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.calcHeightCookiesBox)
      }
    },
    calcHeightCookiesBox() {
      if (this.isCookiesBox) {
        clearTimeout(this.instanceHeightCookiesBox)
        // @ts-ignore: Type 'Timeout' is not assignable to type 'undefined'.
        this.instanceHeightCookiesBox = setTimeout(() => {
          if (this.$refs.cookiesBox) {
            // @ts-ignore:  Property 'getBoundingClientRect' does not exist on type 'Element | Element[] | Vue | Vue[]'
            this.heightCookiesBox = this.$refs.cookiesBox.getBoundingClientRect().height
          }
        }, 1000)
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
  @include root-color-property(background-color, body-bg);
  @include root-color-property(border-color, primary);
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
}
.footer-socials {
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  flex: 0 0 200px;
  max-width: 200px;
}
.footer-link {
}
</style>
