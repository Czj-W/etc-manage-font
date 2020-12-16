<template>
  <a-card>
    <h3>待入账明细表</h3>
    <a-row>
      <a-col class="flex">
        <div class="txt">商户订单号：</div>
        <a-input class="input" placeholder="请输入商户订单号" :value="val" @change="getVal"/>
        <a-button class="btn" type="primary" @click="getNewList">查询</a-button>
        <a-button class="btn" @click="cleanVal">重置</a-button>
        <a-button class="btn" @click="btndownload">导出</a-button>
      </a-col>
    </a-row>
    <a-table :columns="columns" :data-source="list">
      <router-link
        slot="recordSn"
        slot-scope="text, record"
        :to="`/orders/${record.recordSn}?entryType=Order`"
      >{{ text.recordSn }}</router-link>
    </a-table>
  </a-card>
</template>

<script>
  import { download } from '@/utils/util'
  import { getPending } from '@/api/wallet_records'
    import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import axios from 'axios'

  export default {
    data() {
      return {
        loading: false,
        val: '',
        columns: [
          {
            title: '时间',
            dataIndex: 'createdAt'
          },
          {
            title: '商户订单号',
            scopedSlots: { customRender: 'recordSn' }
          },
          {
            title: '账务类型',
            dataIndex: 'title'
          },
          {
            title: '收支金额',
            dataIndex: 'money'
          }
        ],
        list: []
      }
    },
    methods: {
      async getlist() {
        this.loading = true
        try {
          const { data } = await getPending({ orderNo: this.val })
          this.list = data
        } finally {
          this.loading = false
        }
      },
      btndownload() {
        download(Vue, ACCESS_TOKEN, axios, '/merchant_manage/v1/wallet_records/income_records.xlsx', '待入账明细表.xls')
      },
      getVal(e) {
        this.val = e.target.value
      },
      getNewList() {
        this.getlist()
      },
      cleanVal() {
        this.val = ''
      }
    },
    mounted() {
      this.getlist()
    }
  }
</script>

<style lang="less" scoped>
  .flex {
    display: flex;
    align-items: center;
    .txt {
      width: 100px;
    }
    .input {
      width: 300px;
    }
    .btn {
      margin-left: 20px;
    }
  }
</style>
