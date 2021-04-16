import API from '@/api'
import { DEFAULT_PAGE_LIMIT } from '@/utils/const'

const UPDATE_LIST = 'UPDATE_LIST'
const UPDATE_TOTAL = 'UPDATE_TOTAL'
const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE'

export default {
  state: {
    currentPage: 1,
    total: 0,
    list: [],
    limit: DEFAULT_PAGE_LIMIT,
    detail: {}
  },
  mutations: {
    [UPDATE_LIST] (state, data) {
      state.list = data
    },
    [UPDATE_TOTAL] (state, total) {
      state.total = total
    },
    [UPDATE_CURRENT_PAGE] (state, page) {
      state.currentPage = page
    }
  },
  actions: {
    async getList ({ commit, state }) {
      try {
        let { data, count } = await API['article/article'].getList({
          page: state.currentPage,
          limit: DEFAULT_PAGE_LIMIT
        })
        commit(UPDATE_LIST, data)
        commit(UPDATE_TOTAL, count)
        return Promise.resolve(data)
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
}
