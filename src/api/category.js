import request from '@/request'

export default {
  getList (params) {
    return request({
      url: '/category/list',
      params
    })
  },

  save (data) {
    return request({
      url: '/category/save',
      method: 'POST',
      data
    })
  },

  del (data) {
    return request({
      url: '/category/del',
      method: 'POST',
      data
    })
  }
}
