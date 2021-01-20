import API from '@/api'
import images from './images'

const UPDATE_DIRECTORY_LIST = 'UPDATE_DIRECTORY_LIST'

export default {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    [UPDATE_DIRECTORY_LIST] (state, list) {
      state.list = list
    }
  },
  actions: {
    async readDirectory ({ commit }, reqData) {
      try {
        const { data } = await API.media.readDirectory(reqData)
        data.data.map(item => {
          item.url = `${location.origin}${item.url}`
          if (item.isDirectory) {
            item.preview = images.folder
          } else {
            if (/^image/.test(item.type)) {
              item.preview = item.url
            } else if (/^video/.test(item.type)) {
              item.preview = images.video
            } else {
              switch (item.type) {
                case 'application/javascript':
                  item.preview = images.code
                  break
                default:
                  item.preview = images.unkonw
              }
            }
          }
          return item
        })
        commit(UPDATE_DIRECTORY_LIST, data.data)
        return Promise.resolve(data)
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
