import API from '@/api'
import { isObject } from '.'

/**
 * 选择文件
 * @param type 文件类型
 * @param attrs 属性
 * @returns {Promise<FileList>}
 */
export function selectFileHandler(type = '', attrs = {}) {
  return new Promise(resolve => {
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    for (const [attr, value] of Object.entries(attrs)) {
      fileInput.setAttribute(attr, value)
    }
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
 * @return {Promise<Array>} 文件列表
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
