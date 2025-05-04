import { createStore } from 'vuex';

export default createStore({
  state: {
    isLoggedIn: false,
    username: '',
    isAdmin: false
  },
  mutations: {
    setLoginState(state, {username, isAdmin}) {
      state.isLoggedIn = true;
      state.username = username;
      state.isAdmin = isAdmin;
    },
    clearLoginState(state) {
      state.isLoggedIn = false;
      state.username = '';
      state.isAdmin = false;
    }
  },
  actions: {
    login({commit}, {username, isAdmin}) {
      commit('setLoginState', {username, isAdmin});
    },
    logout({commit}) {
      // 清除 localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');
      commit('clearLoginState');
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    username: state => state.username,
    isAdmin: state => state.isAdmin
  },
  modules: {
  }
});
