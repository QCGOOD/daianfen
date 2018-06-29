import Vue from "vue"
import Vuex from "vuex"
import http from "../api/http";
Vue.use(Vuex)
let store = new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    userSave(state, data) {
      state.user = data;
    }
  },
  actions: {
    userSave({ commit }) {
      http.get("member/info").then(res => {
        commit('userSave', res.data.data)
      });
    }
  }
})

export default store