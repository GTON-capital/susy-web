type AuthState = {
  username: string
  isAuth: boolean
}

export const state = () => ({
  isAuth: false,
  username: "",
})

export const mutations = {
  login(state: AuthState, username: string) {
    state.username = username
    state.isAuth = true
  },
  logout(state: AuthState) {
    state.username = ""
    state.isAuth = false
  },
}

export const actions = {}

export const getters = {
  isAuth: (state: AuthState) => state.isAuth,
}
