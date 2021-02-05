import request from '@/request'

export default {
  readDirectory(data) {
    return request({
      url: '/media/read-directory',
      method: 'POST',
      data
    })
  },

  delFile(data) {
    return request({
      url: '/media/del',
      method: 'POST',
      data
    })
  },

  createDirectory(data) {
    return request({
      url: '/media/create-directory',
      method: 'POST',
      data
    })
  }
}
