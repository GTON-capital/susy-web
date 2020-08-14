// States
export const state = () => ({
  isOpenNav: false,
  isHideMobileTitle: false,
  navbarTitle: 'Seamless <br />Crosschain Swaps',
})

// mutations
export const mutations = {
  SET_IS_OPEN_NAV(state, value) {
    state.isOpenNav = value
  },
  SET_NAVBAR_TITLE(state, value) {
    state.navbarTitle = value
  },
  SET_IS_HIDE_MOBILE_TITLE(state, value) {
    state.isHideMobileTitle = value
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
  navbarTitle: (state) => state.navbarTitle,
  isHideMobileTitle: (state) => state.isHideMobileTitle,
}
