// States
export const state = () => ({
  theme: process.env.theme,
  themes: process.env.themes,
})

// mutations
export const mutations = {
  SET_THEME(state, value) {
    state.theme = value
  },
}

// actions
export const actions = {
  setTheme({ commit }, { theme }) {
    // Comment:cvaize
    // Через action вызов мутации для возможных в будущем асинхронных догрузок материалов
    commit('SET_THEME', theme)
  },
}

// Getters
export const getters = {
  theme: (state) => state.theme,
  themes: (state) => state.themes,
}
