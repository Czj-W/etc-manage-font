<template>
  <!-- 优惠券列表
get api/merchant_manage/v1/coupons
param! :status, Integer, required: false, message: "推广渠道类型"
param! :page, Integer, required: false, default: 1, message: "分页" -->

  <!-- 取消优惠券
post api/merchant_manage/v1/coupons/:id/cancel

优惠券导出券码
post api/merchant_manage/v1/coupons/:id/export_coupon_code -->
  <!-- # status, comment: "0未生效 1生效 2失效 3已结束" -->
  <!-- unpublished: 0,
    published: 1,
    unuseful: 2,
    finish: 3 -->
  <a-card>
    <a-row :gutter="48">
      <a-col class="product-type" :span="18">
        <a-radio-group v-model="queryParam.status" @change="onChange" button-style="solid">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="unpublished">未生效</a-radio-button>
          <a-radio-button value="published">已生效</a-radio-button>
          <a-radio-button value="unuseful">已失效</a-radio-button>
          <a-radio-button value="finish">已结束</a-radio-button>
        </a-radio-group>
      </a-col>
      <!-- <a-col :span="6" class="btn-style">
        <a-button @click="btndownload">导出数据</a-button>
      </a-col> -->
    </a-row>
    <a-row :gutter="48">
      <a-col :span="24">
        <a-table
          @change="onPageChage"
          bordered
          :columns="columns"
          :data-source="couponList"
          :pagination="pagination"
          rowKey="couponNo"
          :scroll="{ x: 1500 }"
        ></a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import couponApi from '@/api/coupon'
import { download } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      queryParam: {
        status: 'unpublished',
        page: 1
      },
      couponList: [],

      columns: [
        {
            title: '券名称',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '券类型',
            dataIndex: 'couponTypeCn',
            key: 'couponTypeCn'
        },
        {
            title: '发现量（张）',
            dataIndex: 'publishCount',
            key: 'publishCount'
        },
        {
            title: '已使用（张）',
            dataIndex: 'userCount',
            key: 'id'
        },
        {
            title: '金额/折扣',
            key: 'userCount',
          customRender: (text, row, index) => {
            return (row.couponType === 2 || row.couponType === 5 ? `${row.usedAmount} %` : `${row.usedAmount} 元`)
          }
        },
        {
          title: '券创建时间',
          key: 'createdAt',
          width: 200,
          customRender: (text, row, index) => {
            return row.createdAt
          }
        },
        {
          title: '券领取时间',
          key: 'eventStartTime',
          width: 200,
          customRender: (text, row, index) => {
            return `${row.eventStartTime}~${row.eventEndTime}`
          }
        },
        {
          title: '券有效时间',
          key: 'startTime',
          width: 200,
          customRender: (text, row, index) => {
            return (row.validityType === 0 ? `${row.startTime}~${row.endTime}` : `${row.effective}天`)
          }
        },
        {
          title: '操作',
          width: 150,
          key: 'goodsNo',
          fixed: 'right',
          customRender: (text, row, index) => {
            return (
              <div>
                <a onclick={() => this.btndownload(row.id)}>
                  导出券码
                </a>
                {row.status === 'unpublished' ? <a class="downLoad" onclick={() => this.setOnline(row.id)}>发布</a> : <span class="downLoad">发布</span>}
                <a onclick={() => this.del(row.id)}>删除</a>
              </div>
            )
          }
        }
      ],
      pagination: {}
    }
  },
  methods: {
    async del(id) {
      let { data, meta } = await couponApi.del({ id })
      console.log(data, 123)
      if (+meta.code === 0) {
        this.$message.success('操作成功')
        this.getList()
      }
    },
    onChange(val) {
      this.queryParam.page = 1
      this.queryParam.status = val.target.value
      this.getList()
    },
    onPageChage(pagination) {
      this.queryParam.page = pagination.current
      this.getList()
    },
    getCoupenTypeCn(val) {
      let name = '--'
      switch (val) {
        case 1:
          name = '商品满减券'
          break
       case 2:
          name = '商品折扣券'
          break
       case 3:
          name = '商品直减券'
          break
       case 4:
          name = '店铺满减券'
          break
       case 5:
          name = '店铺折扣券'
          break
       case 6:
          name = '店铺直减券'
          break
        default:
          break
      }
      return name
    },
    async setOnline(id) {
      let { data, meta } = await couponApi.setStatus({ id })
      console.log(data, 123)
      if (+meta.code === 0) {
        this.$message.success('发布成功')
        this.getList()
      }
    },
    async getList() {
      let { data: { page, list } } = await couponApi.list(this.queryParam)
      this.pagination = {
        pageSize: page.pageSize,
        total: page.total
      }
      list.forEach(v => {
        v.couponTypeCn = this.getCoupenTypeCn(v.couponType)
      })
      this.couponList = list
    },
    btndownload(id) {
      download(Vue, ACCESS_TOKEN, axios, `/merchant_manage/v1/coupons/${id}/export_coupon_code.xlsx`, '券码.xlsx')
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="less">
.product-type {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.downLoad {
  margin: 0 10px;
}
</style>
