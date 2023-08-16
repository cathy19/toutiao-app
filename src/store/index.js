import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 為了防止刷新丟失，備份到在地存儲
      setItem(TOKEN_KEY, state.user)
     
    }
  },
  actions: {
  },
  modules: {
  }
})
