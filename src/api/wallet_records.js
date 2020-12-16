import { home } from '@/utils/request'

export function getWalletRecords(parameter) {
  return home({
    url: '/merchant_manage/v1/wallet_records',
    method: 'get',
    params: parameter
  })
}
export function getWalletApply(params) {
  return home({
    url: '/merchant_manage/v1/wallets/withdraw',
    method: 'post',
    data: params
  })
}
export function getWalletList(parameter) {
  return home({
    url: '/merchant_manage/v1/wallets/withdraws',
    method: 'get',
    params: parameter
  })
}
export function getBillsStat(parameter) {
  return home({
    url: '/merchant_manage/v1/wallets/bills_statistics',
    method: 'get',
    params: parameter
  })
}

export function getPending(parameter) {
  return home({
    url: '/merchant_manage/v1/wallet_records/income_records',
    method: 'get',
    params: parameter
  })
}

export function getBills(parameter) {
  return home({
    url: '/merchant_manage/v1/wallets/bills',
    method: 'get',
    params: parameter
  })
}

export function getBillsXls(parameter) {
  return home({
    url: '/merchant_manage/v1/wallets/bills.xls',
    method: 'get',
    params: parameter
  })
}

export function getCollectBills(parameter) {
  return home({
    url: '/merchant_manage/v1/wallets/collect_bills',
    method: 'get',
    params: parameter
  })
}
