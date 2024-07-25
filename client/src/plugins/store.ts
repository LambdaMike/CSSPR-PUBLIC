import { createStore } from 'vuex';

const store = createStore({
  state: {
    navBarTabValue: ''
  },
  mutations: {
    setNavBarTabValue(state, value) {
      state.navBarTabValue = value;
    }
  },
  actions: {
    updateNavBarTabValue({ commit }, value) {
      commit('setNavBarTabValue', value);
    }
  },
  getters: {
    navBarTabValue: state => state.navBarTabValue
  }
});

export default store;