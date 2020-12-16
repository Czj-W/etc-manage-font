<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-row :gutter="48">
        <a-col :span="12" class="flex">
          <a-input-group compact>
            <a-input-search
              placeholder="请输入订单编号\收货人电话"
              style="width: 70%"
              v-model="keyword"
              enterButton="搜索"
              @search="onSearch"
            />
          </a-input-group>
        </a-col>
        <a-col :span="12">
          选择日期：
          <a-range-picker v-model="date" format="YYYY-MM-DD" @change="onDateChange" />
        </a-col>
      </a-row>
      <a-row :gutter="48" v-if="projectType!=='YUNPI'">
        <a-col class="flex product-type">
          <a-radio-group v-model="queryParam.sourceType" @change="onChange" button-style="solid">
            <a-radio-button value="all"> 全部订单 </a-radio-button>
            <a-radio-button value="origin"> 普通订单 </a-radio-button>
            <a-radio-button value="oms"> 供销订单 </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="48">
        <a-col :span="18" class="flex">
          <span
            class="status"
            :class="{ 'status--active': stat.value == queryParam.orderStatus }"
            v-for="stat in stats"
            :key="stat.value"
            @click="onStatusChange(stat.value)"
          >{{ stat.display }}</span
          >
        </a-col>
        <a-col :span="6" class="btn-style">
          <a-button @click="btndownload">导出数据</a-button>
        </a-col>
      </a-row>
    </div>
    <a-spin :spinning="loading">
      <div>
        <a-row :gutter="48" v-for="row in rows" :key="row.orderNo" class="order">
          <a-col :span="24">
            <a-table
              bordered
              :columns="columns"
              :data-source="[row]"
              :pagination="false"
              :rowKey="row => row.orderNo"
              :scroll="{ x: 1500 }"
            >
              <template slot="title" slot-scope="currentPageData">
                <div class="table__header">
                  <div>订单编号：{{ currentPageData[0].orderNo }}</div>
                  <div>下单时间：{{ currentPageData[0].createdAt }}</div>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>

        <a-row class="order" v-if="meta && meta.total > meta.pageSize" type="flex" justify="end">
          <a-col>
            <pagination :total="meta.total" :pageSize="meta.pageSize" show-less-items @change="onPageChange" />
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getOrders } from '@/api/orders'
import { STable } from '@/components'
import { Pagination } from 'ant-design-vue'
import { download } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import axios from 'axios'

export default {
  components: {
    STable,
    Pagination
  },
  data() {
    return {
      queryParam: {
        sourceType: 'all',
        orderStatus: 'all',
        startDate: '',
        endDate: ''
      },
      projectType: '',
      filter: 'orderNo',
      keyword: '',
      pageSize: 10,
      date: [],
      stats: [],
      rows: [],
      meta: {},
      loading: false,
      columns: [
        {
          title: '商品信息',
          width: 300,
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="product">
                  <div class="product_item">
                    <img class="img-style" src={row.imageUrl} />
                    <p class="product__info">{row.title}</p>
                    <div class="product_tag">
                      {row.isOmsOrder ? <a-tag color="orange">供销商品</a-tag> : ''}
                      {row.isAppeal ? <a-tag color="orange">{row.appealStatusName}</a-tag> : <span class=""></span>}
                      {row.isSelfBuy ? <a-tag color="green">掌柜自购</a-tag> : ''}
                    </div>
                  </div>
                </div>
              )
            }
          }
        },
        {
          title: '规格',
          customRender: (text, row, index) => {
            return {
              children: (
                <p class="product__info">
                  {row.orderGoods.map(goods => goods.specification.map(it => it.value).join('/')).join('/') || '--'}
                </p>
              )
            }
          }
        },
        {
          title: '数量',
          dataIndex: 'number'
        },
        {
          title: '商品售价（元）',
          customRender: (text, row, index) => {
            return `￥${row.price}`
          }
        },
        {
          title: '实收价格（元）',
          customRender: (text, row, index) => {
            return `￥${row.realIncome}`
          }
        },
        {
          title: '来源',
          customRender: (text, row, index) => {
            return row.salerMesh.name
          }
        },
        {
          title: '收货人',
          dataIndex: 'expressName'
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus'
        },
        {
          title: '操作',
          width: 100,
          fixed: 'right',
          customRender: (text, row, index) => {
            return (
              <div>
                <router-link to={`/orders/${row.orderNo}?entryType=Order`}>查看详情</router-link>
              </div>
            )
          }
        }
      ]
    }
  },

  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const {
          data: { list, page, meta }
        } = await getOrders(this.queryParam)
        list.forEach(v => {
          if (v.isAppeal) v.appealStatusName = this.filterStatus(v)
        })
        this.rows = list
        this.meta = page
        this.stats = meta.statusOptions
      } finally {
        this.loading = false
      }
    },
    filterStatus(item) {
      let statusName
      if (
        item.appeal.status === 'undeal' ||
        item.appeal.status === 'accept' ||
        item.appeal.status === 'expressed' ||
        item.appeal.status === 'wait_express'
      ) {
        statusName = '退款中'
      }
      if (item.appeal.status === 'refund') statusName = '退款完成'
      return statusName
    },
    btndownload() {
      download(Vue, ACCESS_TOKEN, axios, '/merchant_manage/v1/orders.xlsx', '订单.xls')
    },
    onStatusChange(status) {
      this.queryParam.orderStatus = status
      this.queryParam.page = 1
      this.fetchOrders()
    },
    onPageChange(page) {
      this.queryParam.page = page
      this.fetchOrders()
    },
    onChange(val) {
      this.queryParam.sourceType = val.target.value
      this.fetchOrders()
    },
    onDateChange(e) {
      if (e.length > 0) {
        this.queryParam.startDate = moment(this.date[0]).format('YYYY-MM-DD')
        this.queryParam.endDate = moment(this.date[1]).format('YYYY-MM-DD')
      } else {
        this.queryParam.startDate = ''
        this.queryParam.endDate = ''
      }
      this.queryParam.page = 1
      this.fetchOrders()
    },
    onSearch(keyword) {
      const params = {
        page: 1,
        ...this.queryParam,
        keyword: keyword
      }

      this.queryParam = params
      this.fetchOrders()
    }
  },
  created () {
    this.projectType = process.env.VUE_APP_PROJECT_TYPE
  },
  mounted() {
    this.fetchOrders()
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/dist/antd.less';
@import './style.less';
.product {
  display: flex;
  align-items: center;
}
.row {
  height: 48px;
  display: flex;
  align-items: center;
}
.row:not(:first-child) {
  margin-top: 10px;
}
.flex {
  display: flex;
}
.btn-style {
  display: flex;
  justify-content: flex-end;
}
.flex-1 {
  flex: 1;
}
.keyword__container {
  margin-left: 10px;
}
.status {
  padding: 0 15px 10px 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  &:hover {
    .status--active;
  }
}
.status--active {
  color: @primary-color;
  border-bottom-color: @primary-color;
}
.table__header {
  display: flex;
  justify-content: space-between;
}
.order:not(:first-child) {
  margin-top: 20px;
}
.product__info {
  margin: 0;
}
.product__infos {
  margin-left: 20px;
}
.img-style {
  width: 50px;
  height: 50px;
}
.product-type {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .ant-radio-button-wrapper {
    margin-right: 20px;
  }
}
</style>
