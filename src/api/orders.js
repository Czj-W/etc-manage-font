import { home, oms } from '@/utils/request'

// 订单状态
export const ORDER_STATUS_PAID = 'payed' // 已支付
export const ORDER_STATUS_WAITPAY = 'wait_pay' // 已支付
export const ORDER_STATUS_REFUND = 'refund' // 已退款
export const ORDER_STATUS_REFUND_REFUSE = 'refund_refuse' // 拒绝退款

// 发货状态
export const EXPRESS_STATUS_UNSHIP = 0 // 未发货

// 退款状态
export const REFUND_STATUS_APPEALING = 'appealing' // 待处理

export function getOrders(parameter) {
  return home({
    url: '/merchant_manage/v1/orders',
    method: 'get',
    params: parameter
  })
}

export function getOrdersRefunds(parameter) {
  return home({
    url: '/merchant_manage/v1/order_appeals',
    method: 'get',
    params: parameter
  })
}

export function getOrder(id) {
  return home({
    url: `/merchant_manage/v1/orders/${id}`,
    method: 'get'
  })
}

export function cancelOrder(id) {
  return home({
    url: `merchant_manage/v1/orders/${id}/cancel`,
    method: 'post'
  })
}

export function getBankInfo() {
  return home({
    url: `/merchant_manage/v1/mybanks`,
    method: 'get'
  })
}
export function setBankInfo(parameter) {
  return home({
    url: `/merchant_manage/v1/mybanks`,
    method: 'post',
    data: parameter
  })
}
export function updateBankInfo(parameter) {
  return home({
    url: `/merchant_manage/v1/mybanks/${parameter.id}`,
    method: 'put',
    data: parameter
  })
}

// 发货
export function ship(id, params = { message: '' }) {
  return home({
    url: `/merchant_manage/v1/orders/${id}/express`,
    method: 'post',
    data: params
  })
}

// 退款
export function refund(id, params = { mark: '' }) {
  return home({
    url: `/merchant_manage/v1/orders/${id}/refund_accept`,
    method: 'post',
    data: params
  })
}

// 拒绝退款申请
export function refundRefuse(id, params = { mark: '' }) {
  return home({
    url: `/merchant_manage/v1/orders/${id}/refund_refuse`,
    method: 'post',
    data: params
  })
}

// 填写退回快递地址
export function refundExpress(id, params = { }) {
  return home({
    url: `/merchant_manage/v1/order_appeals/${id}/refund_express`,
    method: 'post',
    data: params
  })
}

// 向供货商申请退款退货
export function omsApply (id, params = { }) {
  return home({
    url: `/merchant_manage/v1/order_appeals/${id}/oms_apply`,
    method: 'post',
    data: params
  })
}

// 供货商退款记录
export function afterSale (parameter) {
  return oms({
    url: `/v1/afterSale`,
    method: 'get',
    params: parameter
  })
}

// 修改收货地址(自有商品)
export function changeDelivery (id, params = { }) {
  return home({
    url: `/merchant_manage/v1/orders/${id}/change_delivery`,
    method: 'post',
    data: params
  })
}

export default {
  getOrders,
  getOrdersRefunds,
  getOrder,
  cancelOrder,
  getBankInfo,
  setBankInfo,
  updateBankInfo,
  ship,
  refund,
  refundRefuse,
  refundExpress,
  omsApply,
  afterSale,
  changeDelivery
}
