import { generateGetters, generateMutations } from '../../utils/utils'

const state = {
  token: localStorage.getItem('token') || '',
  dicList: {},
}

const getters = {
  ...generateGetters(state),
}

const mutations = {
  ...generateMutations(state),
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
