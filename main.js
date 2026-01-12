import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { requestStore } from './store/index.js'
export function createApp() {
  const app = createSSRApp(App)
  // 全局注入 store，页面可通过 inject('store') 获取
  app.provide('store', requestStore())
  return {
    app
  }
}
// #endif