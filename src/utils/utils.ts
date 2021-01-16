//字符串首字母大写
export const firstStringUp = (word) => word.substring(0, 1).toUpperCase() + word.substring(1)
//vuex getters生成
export const generateGetters = (stateObj = {}) => {
  const keys = Object.keys(stateObj)
  const getters = {}
  if (!keys.length) return getters
  keys.forEach((v) => {
    getters[v] = (state) => state[v]
  })
  return getters
}
//vuex mutations生成
export const generateMutations = (stateObj = {}) => {
  const keys = Object.keys(stateObj)
  const mutations = {}
  if (!keys.length) return mutations
  keys.forEach((v) => {
    mutations[`set${firstStringUp(v)}`] = (state, data) => {
      state[v] = data
    }
  })
  return mutations
}
