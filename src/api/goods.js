import { home, oms } from '@/utils/request'

export function create(parameter) {
    return home({
        url: '/merchant_manage/v1/goods',
        method: 'post',
        data: parameter
    })
}

export function show(id) {
    return home({
        url: `/merchant_manage/v1/goods/${id}`,
        method: 'get'
    })
}

export function update(id, parameter) {
    return home({
        url: `/merchant_manage/v1/goods/${id}`,
        method: 'put',
        data: parameter
    })
}

export function list(parameters) {
    return home({
        url: '/merchant_manage/v1/goods',
        method: 'get',
        params: parameters
    })
}

export function del(id) {
    return home({
        url: `/merchant_manage/v1/goods/${id}`,
        method: 'delete'
    })
}

export function updateStock(id, number) {
    return home({
        url: `/merchant_manage/v1/goods/${id}/number`,
        method: 'post',
        data: {
            number
        }
    })
}

export function bactchAction(parameters) {
    return home({
        url: `/merchant_manage/v1/goods/pluck_online`,
        method: 'post',
        data: parameters
    })
}

export function categoriedList(parameters) {
    return home({
        url: `/merchant_manage/v1/category/goods_list`,
        method: 'get',
        params: parameters
    })
}

export function searchGoods(parameters) {
    return home({
        url: `/merchant_manage/v1/goods/like`,
        method: 'get',
        params: parameters
    })
}

export function batchUpdateCategory(categoryIds, goodsNos) {
    return home({
        url: `/merchant_manage/v1/category/bluck_change_category`,
        method: 'post',
        data: {
            categoryIds,
            goodsNos
        }
    })
}

export function sort(fromId, toId) {
  return home({
      url: `/merchant_manage/v1/goods/change_sort`,
      method: 'post',
      data: {
        fromId,
        toId
      }
  })
}

export function goodsList(parameters) {
    return oms({
        url: '/v1/goods/list',
        method: 'get',
        params: parameters
    })
}

export function brandList(parameters) {
    return oms({
        url: '/v1/goods/brand/list',
        method: 'get',
        params: parameters
    })
}

export function cateList(parameters) {
    return oms({
        url: '/v1/goods/category/list',
        method: 'get',
        params: parameters
    })
}

export function goodInfo(parameters) {
    return oms({
        url: `/v1/goods/${parameters.goodId}`,
        method: 'get'
    })
}
export function supply(data) {
    return oms({
        url: '/v1/supply',
        method: 'post',
        data
    })
}

export function selected(parameters) {
    return home({
        url: '/merchant_manage/v1/oms_goods/selected',
        method: 'get',
        params: parameters
    })
}

export function omsGoods(parameter) {
    return home({
        url: '/merchant_manage/v1/oms_goods',
        method: 'post',
        data: parameter
    })
}

export function omsGoodsUpdate(id, parameter) {
    return home({
        url: '/merchant_manage/v1/oms_goods/update',
        method: 'post',
        data: parameter
    })
}

export default {
    create,
    show,
    update,
    list,
    del,
    updateStock,
    bactchAction,
    categoriedList,
    batchUpdateCategory,
    sort,
    brandList,
    cateList,
    omsGoodsUpdate,
    supply,
    searchGoods
}
