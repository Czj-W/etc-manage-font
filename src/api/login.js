import api from './index'
import { home } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return home({
    url: '/merchant_manage/v1/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha(parameter) {
  return home({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return home({
    url: '/merchant_manage/v1/users/info',
    method: 'get'
  })
}

export function getCurrentUserNav(token) {
  return home({
    url: '/user/nav',
    method: 'get'
  })
}

export function logout() {
  return home({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getCode(parameter) {
  return home({
    url: '/merchant_manage/v1/verify_code',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function setEditPW(parameter) {
  return home({
    url: '/merchant_manage/v1/reset_password',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return home({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
