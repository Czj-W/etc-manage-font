<template>
  <div>
    <a-card >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="会员手机/微信名称：">
                <a-input v-model="queryParam.keyword" placeholder="输入手机号码/微信昵称" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="loadData">查询</a-button>
                <a-button style="margin-left: 8px" @click="repair">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
        <a-row :gutter="48">
          <a-col :span="24">
            <a-table :data-source="rows" :columns="columns" :pagination="pagination" @change="onPageChage"></a-table>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>
<script>
  import { ChartCard, STable } from '@/components'
  import { getDistributors } from '@/api/salemans'

  export default {
    components: {
      ChartCard,
      STable
    },
    data() {
      return {
        pagination: {},
        queryParam: {},
        rows: [],
        page: 1,
        columns: [
          {
            title: '分销员',
            dataIndex: 'nickname',
            key: 'nickname'
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone'
          },
          {
            title: '销售金额',
            dataIndex: 'totalSales',
            key: 'totalSales'
          },
          {
            title: '获得佣金',
            dataIndex: 'totalCommission',
            key: 'totalCommission'
          },
          {
            title: '加入时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
          }
          // {
          //   title: '操作',
          //   customRender: (text, row, index) => {
          //     return {
          //       children: <a>查看</a>
          //     }
          //   }
          // }
        ]
      }
    },
    methods: {
      onPageChage(pagination) {
        this.page = pagination.current
        this.loadData()
      },
      repair() {
        this.queryParam = {}
        this.loadData()
      },
      async loadData() {
        const params = {
          pageNum: this.page,
          pageSize: this.pagination.pageSize
        }
        const {
          data: { page, meta, stats, list }
        } = await getDistributors(Object.assign(params, this.queryParam))
        this.meta = meta
        this.stats = stats
        this.pagination = {
          pageSize: page.pageSize,
          total: page.total
        }
        this.rows = list
      }
    },
    created() {
      this.loadData()
    },
    mounted() {}
  }
</script>
<style lang="less" scoped>
  .box-wraper {
    margin-bottom: 20px;
    .ant-col {
      background-color: #fff;
      text-align: center;
      font-size: 1.5em;
      font-weight: bold;
      padding: 20px;
      div {
        line-height: 2em;
      }
      .right {
        border-left: 1px solid #ccc;
      }
    }
  }
</style>
