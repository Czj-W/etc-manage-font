import { home } from '@/utils/request'

export function create(parameter) {
  return home({
    url: '/merchant_manage/v1/coupons',
    method: 'post',
    data: parameter
  })
}
export function list(parameters) {
  return home({
    url: '/merchant_manage/v1/coupons',
    method: 'get',
    params: parameters
  })
}
export function del(parameter) {
  return home({
    url: `/merchant_manage/v1/coupons/${parameter.id}/cancel`,
    method: 'post',
    data: parameter
  })
}
export function setStatus(parameter) {
  return home({
    url: `/merchant_manage/v1/coupons/${parameter.id}/publish`,
    method: 'post',
    data: parameter
  })
}
export default {
  create,
  list,
  del,
  setStatus
}
