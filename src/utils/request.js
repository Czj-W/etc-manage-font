import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
// import { VueAxios } from './axios'
import { ACCESS_TOKEN, MESH_NO } from '@/store/mutation-types'

class Fetch {
  constructor (baseURL) {
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    this.instance.interceptors.request.use(...this.request())
    this.instance.interceptors.response.use(...this.response())
  }
  request () {
    return [
      function (config) {
        const token = Vue.ls.get(ACCESS_TOKEN)
        if (token) {
          config.headers['Authorization'] = token
        }
        const params = config.params || {}
        if (config.url.indexOf('v1') >= 0) {
          params['mesh_no'] = Vue.ls.get(MESH_NO)
        }
        config.params = params
        return config
      },
      function (error) {
        err(error)
      }
    ]
  }
  response () {
    return [
      function (response) {
        console.log(response, 123)
        const code = response.data.resultCode
        if (code === 1000) {
          message.error(response.data.result)
        } else if (code > 0 && code !== 1000) {
          throw new Error(response.data.result)
        }
        return response.data
      },
      function (error) {
        err(error)
      }
    ]
  }
}

const err = error => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

let homeAPI = process.env.VUE_APP_API_BASE_URL
let uploadAPI = 'https://gewu-api-production.bagrids.com/api'
let omsAPI = 'https://gw-oms.bagrids.com/gewu-oms/api'
if (process.env.NODE_ENV !== 'production' && process.env.VUE_APP_PROJECT_TYPE !== 'YUNPI') {
  uploadAPI = 'http://gewu-api-staging.jifenone.com/api'
  homeAPI = 'http://gewu-api-staging.jifenone.com/api'
  // homeAPI = 'http://zihao.ngrok.dy.bilifoo.com:801/api'
  omsAPI = 'http://gw-oms-staging.bagrids.com/gewu-oms/api'
}
const home = new Fetch(homeAPI).instance
const oms = new Fetch(omsAPI).instance
const uploadapi = new Fetch(uploadAPI).instance
export {
  home,
  oms,
  uploadapi,
  omsAPI,
  homeAPI
}
