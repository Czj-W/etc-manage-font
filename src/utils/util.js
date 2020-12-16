import { omsAPI, homeAPI } from './request'
import { MESH_NO } from '@/store/mutation-types'
import qs from 'qs'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function download(Vue, ACCESS_TOKEN, axios, url, filename, data = {}, isOMs = false) {
  const downLoadSrc = `${isOMs ? omsAPI : homeAPI}${url}`
  const token = Vue.ls.get(ACCESS_TOKEN)
  const meshNo = Vue.ls.get(MESH_NO)
  axios({
    url: downLoadSrc,
    method: isOMs ? 'POST' : 'GET',
    responseType: 'blob',
    isDownExcel: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: token || ''
    },
    params: {
      mesh_no: meshNo
    },
    data: qs.stringify(data)
  })
    .then(res => {
      const fileURL = window.URL.createObjectURL(
        new Blob([res.data], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        })
      )
      const fileLink = document.createElement('a')
      fileLink.href = fileURL
      fileLink.setAttribute('download', filename)
      document.body.appendChild(fileLink)
      fileLink.click()
    })
    .catch(err => {
      console.log(err)
    })
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

export function isNumber(arr) {
  let isblank = false
  const zeroList = arr.filter(item => item.number === 0)
  if (arr.length === zeroList.length) isblank = true
  return isblank
}
/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
