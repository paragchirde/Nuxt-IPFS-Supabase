export const strict = false
export const state = () => ({
  theme: 'dark',
  user: null
});

export const mutations = {
  SET_USER(state, payload) {
    state.user = payload
    localStorage.setItem('user', payload)
  }
}

export const getters = {}

export const actions = {}
