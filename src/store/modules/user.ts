import { getUserInfo } from '../../graphql/api'
import { generateGetters, generateMutations } from '../../utils/utils'
import { query } from '../../utils/apollo'
import { readAll ,readCount} from '../../graphql/user/userMessage.js'
import { Toast } from 'vant'

const state = {
  info: {
    nickName: '',
  },
  message: {
    list: [],
    page: 0,
    size: 5,
    total: 0,
    unread:0
  },
}

const getters = {
  ...generateGetters(state),
}

const mutations = {
  ...generateMutations(state),
  setMessageList(state, data) {
    state.message.list = state.message.list.concat(data)
  },
  setMessageTotal(state, data) {
    state.message.total = data
  },
  setMessageUnread(state, data) {
    state.message.unread = data
  },
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
  getUserMessage({ commit, state }) {
    state.message.page++
    return new Promise((resolve) => {
      query(readCount,{
        filter: {
          userId: JSON.stringify({
            cond: 'eq',
            value: state.info.id,
          }),
        },
      }).then(res=>{
        if (!res.errors) {
          commit('setMessageTotal', res.data.data.total)
        } else {
          Toast.fail(res.data.message)
        }
      })
      query(readAll, {
        page: {
          limit: state.message.size,
          offset: (state.message.page - 1) * state.message.size,
        },
        filter: {
          userId: JSON.stringify({
            cond: 'eq',
            value: state.info.id,
          }),
        },
      }).then((res) => {
        if (!res.errors) {
          commit('setMessageList', res.data.data)
          resolve(res.data.data)
        } else {
          Toast.fail(res.data.message)
        }
      })
    })
  },
  getUserUnreadMessage({ commit, state }) {
    return new Promise((resolve) => {
      query(readCount,{
        filter: {
          userId: JSON.stringify({
            cond: 'eq',
            value: state.info.id,
          }),
          status:JSON.stringify({
            cond: 'eq',
            value: '0',
          })
        },
      }).then(res=>{
        if (!res.errors) {
          commit('setMessageUnread', res.data.data.total)
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
