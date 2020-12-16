// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
// import { VueAxios } from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import { Dialog } from '@/components'
import { FormModel } from 'ant-design-vue'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
// mount axios Vue.$http and this.$http
// Vue.use(VueAxios)
Vue.use(Dialog)
Vue.use(FormModel)
Vue.use(VueClipboard)

;(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.rel = 'icon'
    link.href = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? 'https://assets-gewu.bagrids.com/admin/yunpi-logos.png' : (process.env.VUE_APP_PROJECT_TYPE === 'HOMAHO' ? 'https://assets-gewu.bagrids.com/admin/HOMAHO-logo.jpg' : 'https://assets-gewu.bagrids.com/admin/logo.png')
    document.getElementsByTagName('head')[0].appendChild(link)
  })()

new Vue({
    router,
    store,
    created: bootstrap,
    render: h => h(App)
}).$mount('#app')
