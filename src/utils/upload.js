import API from '@/api'
import { isObject } from '.'

export function selectFileHandler(type) {
  return new Promise(resolve => {
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    switch (type) {
      case 'image':
        fileInput.setAttribute('accept', 'image/*')
        break
      case 'video':
        fileInput.setAttribute('accept', 'video/*')
        break
      case 'audio':
        fileInput.setAttribute('accept', 'audio/*')
        break
    }
    fileInput.onchange = async event => {
      resolve(event.target.files)
    }
    fileInput.click()
  })
}

/**
 * 上传文件
 * @param {FileList} files
 * @param {Object} data
 * @return {Promise}
 */
export default function(files, data) {
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
