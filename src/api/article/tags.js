import request from '@/request'

export default {
  getList (params) {
    return request({
      url: '/tags/list',
      params
    })
  },

  save (data) {
    return request({
      url: '/tags/save',
      method: 'POST',
      data
    })
  },

  del (data) {
    return request({
      url: '/tags/del',
      method: 'POST',
      data
    })
  }
}
