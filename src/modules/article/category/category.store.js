import API from '@/api'
import { deepTree, sortTreeArr } from '@/utils'

const UPDATE_TREE = 'UPDATE_TREE'
const UPDATE_FLAT_LIST = 'UPDATE_FLAT_LIST'

export default {
  state: {
    tree: [],
    flatList: []
  },
  mutations: {
    [UPDATE_TREE] (state, data) {
      state.tree = data
    },
    [UPDATE_FLAT_LIST] (state, data) {
      state.flatList = data
    }
  },
  actions: {
    async getList ({ commit }) {
      try {
        let { data } = await API['article/category'].getList()
        commit(UPDATE_FLAT_LIST, data.data)
        commit(UPDATE_TREE, [
          {
            id: 0,
            name: '顶级栏目',
            children: sortTreeArr(deepTree(data.data))
          }
        ])
        return Promise.resolve(data.data)
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
}
