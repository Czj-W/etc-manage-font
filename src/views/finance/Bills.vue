<template>
  <a-card>
    <a-tabs type="card">
      <a-tab-pane key="bills" tab="交易明细表">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="选择日期">
                  <a-range-picker v-model="bills.form.date" valueFormat="YYYY-MM-DD" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="商户订单号">
                  <a-input v-model="bills.form.orderNo" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="资金流向">
                  <a-radio-group v-model="bills.form.inCome">
                    <a-radio :value="true">收入</a-radio>
                    <a-radio :value="false">支出</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="财务类型">
                  <a-select v-model="bills.form.billType" placeholder="请选择">
                    <a-select-option value="">全部</a-select-option>

                    <a-select-option :value="val.value" v-for="(val,idx) in statusOptions" :key="idx">{{ val.display }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :md="8" :sm="24">
                <a-form-model-item label="订单状态"></a-form-model-item>
              </a-col> -->
              <a-col :md="8">
                <a-form-model-item>
                  <a-button type="primary" @click="getData" style="margin-right:20px">查询</a-button>
                  <a-button @click="resetBills" style="margin-right:20px">重置</a-button>
                  <a-button @click="btndownload" style="margin-right:20px">导出</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>

        <a-row :gutter="48" >
          <a-col class="statistics mgb-20">
            <div class="statistic">
              <a-card>
                <a-statistic title="收入金额" :value="bills.stat.incomeMoney"></a-statistic>
              </a-card>
            </div>
            <div class="statistic">
              <a-card>
                <a-statistic title="收入笔数" :value="bills.stat.incomeCount"></a-statistic>
              </a-card>
            </div>
            <div class="statistic">
              <a-card>
                <a-statistic title="支出金额" :value="bills.stat.costMoney"></a-statistic>
              </a-card>
            </div>
            <div class="statistic">
              <a-card>
                <a-statistic title="支出笔数" :value="bills.stat.costBills"></a-statistic>
              </a-card>
            </div>
          </a-col>
        </a-row>

        <a-table
          :columns="bills.columns"
          rowKey="id"
          :dataSource="bills.rows"
          :pagination="bills.pagination"
        ></a-table>
      </a-tab-pane>

      <!-- <a-tab-pane key="collect_bills" tab="汇总表">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="请选择年月">
                  <a-month-picker :disabled-date="disabledDate" placeholder="请选择年月" @change="onDateChange" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item>
                  <a-button type="primary" @click="getCollectBills">查询</a-button>
                  <a-button @click="resetCollectBills">重置</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>

        <a-table
          :columns="collect.columns"
          rowKey="id"
          :dataSource="collect.rows"
          :expandedRowRender="collect.expandedRowRender"
          bordered
        ></a-table>
      </a-tab-pane> -->
    </a-tabs>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Statistic } from 'ant-design-vue'
import { getBillsStat, getBills, getCollectBills } from '@/api/wallet_records'

import { download } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import axios from 'axios'

export default {
  components: {
    'a-statistic': Statistic
  },
  data() {
    return {
      page: 1,
      statusOptions: [],
      bills: {
        form: {
          date: [],
          startDate: '',
          endDate: '',
          inCome: undefined,
          orderNo: '',
          billType: undefined
        },
        stat: {
          costBills: '',
          costMoney: '',
          incomeCount: '',
          incomeMoney: ''
        },
        pagination: {
          total: 0,
          pageSize: 10,
          onChange: page => {
            this.page = page
            this.getBills()
          }
        },
        rows: [],
        columns: [
          {
            title: '时间',
            dataIndex: 'payAt'
          },
          {
            title: '商户订单号',
            customRender: (text, row, index) => {
              return (
                <div>
                  <router-link to={`/orders/${row.recordSn}?entryType=Order`}>{row.recordSn}</router-link>
                </div>
              )
            }
          },
          {
            title: '账务类型',
            dataIndex: 'dealType'
          },
          {
            title: '收支金额(元)',
            customRender: (text, row, index) => {
              return {
                children: <div>{row.isIncome ? '+' + row.money : '-' + row.money}</div>
              }
            }
          }
        ]
      },
      collect: {
        form: {
          year: '',
          month: ''
        },
        rows: [],
        columns: [
          {
            title: '日期',
            dataIndex: 'statisticsDate'
          },
          {
            title: '收入金额',
            dataIndex: 'incomeMoney'
          },
          {
            title: '收入笔数',
            dataIndex: 'incomeCount'
          },
          {
            title: '支出金额',
            dataIndex: 'costMoney'
          },
          {
            title: '支出笔数',
            dataIndex: 'costCount'
          },
          {
            title: '收益',
            dataIndex: 'amount'
          },
          {
            title: '查看明细'
          }
        ],
        expandedRowRender (list) {
          const child = list.bill_items.map((item, index) => (
            <div key={index}>
              { item.title }：{ item.is_income ? '+' : '-' }{ item.money }
              笔数：{ item.bill_count }
            </div>
          ))
          return <div>{ child }</div>
        }
      }
    }
  },
  created () {
    this.getData()
    this.getCollectBills()
  },
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    getData (pagination = {}) {
      this.bills.form.startDate = this.bills.form.date[0] || ''
      this.bills.form.endDate = this.bills.form.date[1] || ''
      this.getBillsStat(this.bills.form)
      this.getBills(this.bills.form, pagination.current || 1)
    },
    async getBillsStat (params) {
      try {
        const data = await getBillsStat(params)
        if (data.meta.code === 0) {
          this.bills.stat = data.data
        }
      } finally {}
    },
    async getBills (params, page) {
      try {
        const data = await getBills({
          page: this.page || 1,
          ...params
        })
        if (data.meta.code === 0) {
          this.bills.rows = data.data.list
          this.bills.pagination.total = data.data.page.total
          this.statusOptions = data.data.meta.statusOptions
        }
      } finally {}
    },
    resetBills () {
      this.bills.form = {
        date: [],
        startDate: '',
        endDate: '',
        inCome: undefined,
        orderNo: '',
        billType: undefined
      }
      this.getData()
    },
    resetCollectBills() {
      this.collect.form = {
        year: '',
        month: ''
      }
      this.getCollectBills()
    },
    async getCollectBills() {
      try {
        const data = await getCollectBills(this.collect.form)
        if (data.meta.code === 0) {
          this.collect.rows = data.data
        }
      } finally {}
    },
    btndownload() {
      download(Vue, ACCESS_TOKEN, axios, '/merchant_manage/v1/wallets/bills.xlsx', '流水账明细.xls')
    },
    onDateChange(date) {
      this.collect.form.year = moment(date).format('YY')
      this.collect.form.month = moment(date).format('MM')
    }
  }
}
</script>

<style lang="less" scoped>
.statistics,
.statistic__title {
  display: flex;
}
.statistic {
  flex: 1;
}
.statistic__title {
  justify-content: space-between;
}
.statistic:not(:first-child) {
  margin-left: 20px;
}
.mgb-20{
  margin-bottom: 20px !important;
}
</style>
