// States
export const state = () => ({
  isOpenNav: false,
})

// mutations
export const mutations = {
  SET_IS_OPEN_NAV(state, value) {
    state.isOpenNav = value
  },
}

// actions
export const actions = {
  isOpenNavToggle({ commit, getters }) {
    commit('SET_IS_OPEN_NAV', !getters.isOpenNav)
  },
}

// Getters
export const getters = {
  isOpenNav: (state) => state.isOpenNav,
}
