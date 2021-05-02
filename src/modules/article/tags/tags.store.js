import API from '@/api'

const UPDATE_ALL_LIST = 'UPDATE_ALL_LIST'

export default {
  state: {
    allList: []
  },
  mutations: {
    [UPDATE_ALL_LIST] (state, data) {
      state.allList = data
    }
  },
  actions: {
    async getAllList ({ commit }) {
      try {
        const { data } = await API['article/tags'].getList({
          all: 1
        })
        commit(UPDATE_ALL_LIST, data)
        return Promise.resolve(data)
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
