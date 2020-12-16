import { home } from '@/utils/request'

export function create(parameter) {
    return home({
        url: '/merchant_manage/v1/category',
        method: 'post',
        data: parameter
    })
}

export function show(id) {
    return home({
        url: `/merchant_manage/v1/category/${id}`,
        method: 'post'
    })
}

export function update(id, parameter) {
    return home({
        url: `/merchant_manage/v1/category/${id}`,
        method: 'put',
        data: parameter
    })
}

export function list(parameters) {
    return home({
        url: '/merchant_manage/v1/category',
        method: 'get',
        params: parameters
    })
}

export function del(id) {
    return home({
        url: `/merchant_manage/v1/category/${id}`,
        method: 'delete'
    })
}

export function sort(fromId, toId) {
    return home({
        url: `/merchant_manage/v1/category/change_sort`,
        method: 'post',
        data: {
            fromId,
            toId
        }
    })
}

export function products(parameters) {
    return home({
        url: `/merchant_manage/v1/category/goods`,
        method: 'get',
        params: parameters
    })
}

export function unbindProduct(categoryID, goodsNo) {
    return home({
        url: `/merchant_manage/v1/category/${categoryID}/goods_delete`,
        method: 'post',
        data: {
            goodsNo
        }
    })
}

export default {
    create,
    show,
    update,
    list,
    del,
    sort,
    products,
    unbindProduct
}
