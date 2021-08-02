<template>
  <div class="cnt">
    <!-- <input v-model="login" />
    <input v-model="pass" type="password" /> -->

    <form-input v-model="username">
      <template v-slot:label>
        Login
        <span class="text-secondary float-right font-weight-normal"> </span>
      </template>
    </form-input>
    <form-input v-model="password" type="password">
      <template v-slot:label>
        Password
        <span class="text-secondary float-right font-weight-normal"> </span>
      </template>
    </form-input>
    <btn class="btn-primary btn-block" @click="auth">
      Authorize
    </btn>
  </div>
</template>

<script>
import { isNil } from "lodash"
import FormInput from "~/components/FormInput.vue"
import Btn from "~/components/Btn.vue"

const VALID_LOGIN = "brave_explorer"
const VALID_PASSWORD = "k18sh.-2kashbzzoWW"

export default {
  components: {
    Btn,
    FormInput,
  },
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    async auth() {
      // this.$auth
      //   .loginWith("local", {
      //     data: {
      //       /* data to post to server */
      //       username: this.username,
      //       password: this.password,
      //     },
      //   })
      //   .then(() => this.$toast.success("Logged In!"))

      // await this.$auth.login({ username: this.username, password: this.password })
      // await this.$auth.setUser({ username: this.username })

      // this.$store.commit("")
      // if (this.password !== VALID_PASSWORD) {
      //   return
      // }
      // if (this.username !== VALID_LOGIN) {
      //   return
      // }

      // this.$store.commit("auth/login", {
      //   username: this.username,
      // })

      // window.localStorage.setItem("susy_authorized", 1)

      this.$router.push("/swap")
    },
  },
  mounted() {
    // const isAuth = window.localStorage.getItem("susy_authorized")

    // if (!isNil(isAuth)) {

    //   console.log({ router: this.$router })
    //   this.$router.push("/swap")
    // }
    this.$router.push("/swap")
  },
}
</script>

<style lang="scss" scoped>
.cnt {
  width: 300px;
  margin: auto;
  height: 50vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
}
</style>
