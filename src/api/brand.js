import { home } from '@/utils/request'

export function list(parameters) {
  return home({
    url: '/merchant_manage/v1/brands',
    method: 'get',
    params: parameters
  })
}
export default {
  list
}
