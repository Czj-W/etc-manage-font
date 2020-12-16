<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-row :gutter="48">
        <a-col :span="12" class="flex">
          <a-input-group compact>
            <!-- <a-select v-model="filter">
              <a-select-option
                :value="opt.value"
                v-for="opt in filters"
                :key="opt.value"
              >{{ opt.display }}</a-select-option>
            </a-select>-->
            <a-input-search
              placeholder="请输入退款订单号/收货人电话"
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
      <a-divider />
      <div class="btn-box" v-if="projectType!=='YUNPI'">
        <a-radio-group v-model="orderType" @change="onChange" button-style="solid">
          <a-radio-button value="0">
            全部商品售后
          </a-radio-button>
          <a-radio-button value="origin">
            自有商品售后
          </a-radio-button>
          <a-radio-button value="oms">
            供销商品售后
          </a-radio-button>
        </a-radio-group>
      </div>
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
        <a-row :gutter="48" v-for="(row, index) in rows" :key="index" class="order">
          <a-col :span="24">
            <a-table
              bordered
              :columns="columns"
              :data-source="[row]"
              :pagination="false"
              :rowKey="row => row.orderNo"
              :scroll="{ x: 1300 }"
            >
              <template slot="title" slot-scope="currentPageData">
                <div class="table__header">
                  <div>退款订单号：{{ currentPageData[0].appealNo }}</div>
                  <div v-if="currentPageData[0].omsOrderNo !== ''">
                    供销采购单号：{{ currentPageData[0].omsOrderNo }}
                  </div>
                  <div>申请售后时间：{{ currentPageData[0].appealCreate }}</div>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>

        <a-row class="order" v-if="meta.total > meta.pageSize" type="flex" justify="end">
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
import { getOrdersRefunds } from '@/api/orders'
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
      date: [],
      orderType: '0',
      queryParam: {
        orderStatus: 'all',
        sourceType: ''
      },
      filter: 'orderNo',
      keyword: '',
      pageSize: 10,
      stats: [],
      rows: [],
      meta: {},
      loading: false,
      projectType: '',
      // filters: [
      //   { value: 'orderNo', display: '订单编号' },
      //   { value: 'expressPhone', display: '收货人手机号' }
      // ],
      columns: [
        {
          title: '商品信息',
          width: 400,
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="goods">
                  <div class="goods-item">
                    <img class="product__cover_img" src={row.imageUrl} />
                    <div class="goods_name">{row.title}</div>
                    <div class="product_tag">
                      {row.isOmsOrder ? <a-tag color="orange">供销商品</a-tag> : <span class="product_tag"></span>}
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
                <p>
                  {row.orderGoods.map(goods => goods.specification.map(it => it.value).join('/')).join('/') || '--'}
                </p>
              )
            }
          }
        },
        {
          title: '售后状态',
          customRender: (text, row, index) => {
            return `${row.appealStatusName ? row.appealStatusName : '--'}`
          }
        },
        {
          title: '数量',
          dataIndex: 'number'
        },
        {
          title: '商品售价',
          dataIndex: 'price'
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
          title: '操作',
          width: 100,
          fixed: 'right',
          customRender: (text, row, index) => {
            return (
              <div>
                <p>
                  <router-link to={`/orders/${row.orderNo}?entryType=afterSale`}>查看详情</router-link>
                </p>
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
        } = await getOrdersRefunds(this.queryParam)
        const newList = []
        list.forEach(v => {
          newList.push({
            appealNo: v.appeal.appealNo || '',
            appealCreate: v.appeal.createdAt || '',
            appealStatusName: v.appeal.statusName || '',
            ...v.order
          })
        })
        this.rows = newList
        this.meta = page
        this.stats = meta.statusOptions
      } finally {
        this.loading = false
      }
    },
    onChange(e) {
      let type = e.target.value
      if (+type === 0) {
        this.queryParam.sourceType = ''
      } else {
        this.queryParam.sourceType = type
      }
      this.fetchOrders()
    },
    btndownload() {
      download(Vue, ACCESS_TOKEN, axios, '/merchant_manage/v1/order_appeals.xlsx', '售后订单.xls')
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
    onStatusChange(status) {
      this.queryParam.orderStatus = status
      this.queryParam.page = 1
      this.fetchOrders()
    },
    onPageChange(page) {
      this.queryParam.pageNum = page
      this.fetchOrders()
    },
    onSearch(keyword) {
      const params = {
        page: 1,
        orderStatus: this.queryParam.orderStatus,
        keyword
      }

      this.queryParam = params
      this.fetchOrders()
    }
  },
  created() {
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
.btn-box {
  margin-bottom: 20px;
  .ant-radio-button-wrapper {
    margin-right: 20px;
  }
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
  margin: 0 20px;
}
.product__cover_img {
  width: 75px;
  height: 75px;
}
.goods {
  width: 100%;
  .goods-item {
    width: 100%;
    display: flex;
    align-items: center;
    .goods_name {
      flex: 1;
      margin-left: 10px;
    }
  }
}
</style>
