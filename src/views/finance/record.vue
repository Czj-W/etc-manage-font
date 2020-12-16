<template>
  <a-card>
    <div class="input-style">
      <a-input-search placeholder="请输入提现单号" enter-button="搜索" @search="onSearch" />
    </div>
    <a-table :data-source="rows" :columns="columns" :pagination="pagination" @change="onPageChage"></a-table>
  </a-card>
</template>

<script>
  import { getWalletList } from '@/api/wallet_records'

  export default {
    data() {
      return {
        keyword: '',
        page: 1,
        pagination: {},
        columns: [
          {
            title: '提现单号',
            dataIndex: 'orderNo'
          },
          {
            title: '提现时间',
            dataIndex: 'createdAt'
          },
          {
            title: '收款账户',
            dataIndex: 'receipterName'
          },
          {
            title: '提现金额',
            dataIndex: 'money'
          },

          {
            title: '到账情况',
          customRender: (text, row, index) => {
            return row.checkStatus === 0 ? '待可入账' : (row.checkStatus === 1 ? '待入账' : (row.checkStatus === 2 ? '已入账' : '已取消'))
          }
          }
        ],
        rows: []
      }
    },
    methods: {
      onSearch(val) {
        this.keyword = val
        this.getList()
      },
      async getList() {
        this.loading = true
        try {
          const {
            data
          } = await getWalletList({ keyword: this.keyword, page: this.page })
          this.rows = data.list
          this.pagination = {
            pageSize: data.page.pageSize,
            total: data.page.total
          }
        } finally {
          this.loading = false
        }
      },
      onPageChage(pagination) {
        this.page = pagination.current
        this.getList()
      }
    },
    created () {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  .input-style {
    width: 50%;
    margin-bottom: 20px;
  }
</style>
