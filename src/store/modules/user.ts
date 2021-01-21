import { getUserInfo } from '../../graphql/api'
import { generateGetters, generateMutations } from '../../utils/utils'
import { Toast } from 'vant'

const state = {
  info: {
    nickName: '',
  },
}

const getters = {
  ...generateGetters(state),
}

const mutations = {
  ...generateMutations(state),
}

const actions = {
  getUserInfo({ commit, state }, axios) {
    return new Promise((resolve) => {
      getUserInfo().then((res) => {
        if (res.data.code === '0') {
          commit('setInfo', res.data.data)
          resolve(res.data.data)
        } else {
          Toast.fail(res.data.message)
        }
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
