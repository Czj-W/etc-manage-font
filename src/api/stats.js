import { home } from '@/utils/request'

export function getStats() {
  return home({
    url: '/merchant_manage/v1/stats',
    method: 'get'
  })
}
