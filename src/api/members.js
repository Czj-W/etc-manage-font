import { home } from '@/utils/request'

export function getMembers(parameter) {
  return home({
    url: '/merchant_manage/v1/members',
    method: 'get',
    params: parameter
  })
}
