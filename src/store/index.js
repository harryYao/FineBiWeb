import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: '',
    username: ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      Cookies.set('fine_auth_token', token)
    },
    setUserName(state, n) {
      state.username = n;
    },
    setKeepName(state, v) {
      state.keepname = v;
    }
  },
  getters: {
    token: (state) => {
      return state.token
    },
    username: (state) => {
      return state.username
    },
    keepname: (state) => {
      return state.keepname;
    }
  },
  plugins: [persistedState()]
})

export default store
