import request from '@/request'

export default {
  getList (params) {
    return request({
      url: '/article/list',
      params
    })
  },

  getDetail (id) {
    return request({
      url: `/article/detail/${id}`
    })
  },

  save (data) {
    return request({
      url: '/article/save',
      method: 'POST',
      data
    })
  },

  del (data) {
    return request({
      url: '/article/del',
      method: 'POST',
      data
    })
  }
}
