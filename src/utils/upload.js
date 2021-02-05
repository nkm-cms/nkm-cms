import API from '@/api'
import { isObject } from '.'

/**
 * 上传文件
 * @param {FileList} files
 * @param {Object} data
 * @return {Promise}
 */
export default function (files, data) {
  const formData = new FormData()
  if (isObject(data)) {
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }
  }
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }
  return API.upload(formData)
}
