import Vue from 'vue'
import store from '../store'

// 按钮权限指令
Vue.directive('role', {
  inserted (el, { value }) {
    if (value && store.state.authen.btnCodes.findIndex(v => v === value) === -1) {
      el.parentNode.removeChild(el)
    }
  }
})
