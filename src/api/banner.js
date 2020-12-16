import { home } from '@/utils/request'

export function create(parameter) {
  return home({
    url: '/merchant_manage/v1/mesh_banners',
    method: 'post',
    data: parameter
  })
}

export function update(id, parameter) {
  return home({
    url: `/merchant_manage/v1/mesh_banners/${id}`,
    method: 'put',
    data: parameter
  })
}

export function list(parameters) {
  return home({
    url: '/merchant_manage/v1/mesh_banners',
    method: 'get',
    params: parameters
  })
}

export function del(id) {
  return home({
    url: `/merchant_manage/v1/mesh_banners/${id}`,
    method: 'delete'
  })
}

export function delByCate(id) {
  return home({
    url: `/merchant_manage/v1/category_banners/${id}`,
    method: 'delete'
  })
}

export function listByCate(parameters) {
  return home({
    url: '/merchant_manage/v1/category_banners',
    method: 'get',
    params: parameters
  })
}
export function createByCate(parameter) {
  return home({
    url: '/merchant_manage/v1/category_banners',
    method: 'post',
    data: parameter
  })
}
export function updateByCate(id, parameter) {
  return home({
    url: `/merchant_manage/v1/category_banners/${id}`,
    method: 'put',
    data: parameter
  })
}

export default {
  create,
  update,
  list,
  del,
  listByCate,
  createByCate,
  updateByCate,
  delByCate
}
