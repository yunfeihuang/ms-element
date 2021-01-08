// state
let state = {
  list: {
    page: 1,
    rows: 10,
    list: [],
    total: 1000
  }
}
// actions
const actions = {
  list ({ commit, state }, params) { // 获取列表
    state.list.page = params.page
    let array = []
    for (let i = 0; i < state.list.rows; i++) {
      array.push({
        name: 'name----' + ((Number(state.list.page) - 1) * state.list.rows + i)
      })
    }
    state.list.list = array
  }
}
// mutations
const mutations = {
  LIST (state, { data }) {
    state.list = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
