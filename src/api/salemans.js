import { home } from '@/utils/request'

export function getDistributors(parameter) {
  return home({
    url: '/merchant_manage/v1/distributors',
    method: 'get',
    params: parameter
  })
}

export function setPW(parameter) {
  return home({
    url: '/merchant_manage/v1/token_words',
    method: 'post',
    data: parameter
  })
}

export function getListByType(parameter) {
  return home({
    url: '/merchant_manage/v1/token_words',
    method: 'get',
    params: parameter
  })
}
export function update(id, parameter) {
  return home({
    url: `/merchant_manage/v1/token_words/${id}`,
    method: 'put',
    data: parameter
  })
}

export function getJoinList(id, parameter) {
  return home({
    url: `/merchant_manage/v1/token_words/${id}/members`,
    method: 'get',
    params: parameter
  })
}

export function getMeshsInfo(parameter) {
  return home({
    url: '/merchant_manage/v1/meshes/info',
    method: 'get',
    params: parameter
  })
}
