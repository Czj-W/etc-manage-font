<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-row :gutter="48" class="input-style">
        <a-col :md="16" :sm="24" class="flex">
          <a-input-search
            placeholder="请输入商品名称"
            style="width: 70%"
            v-model="queryParam.keyword"
            enterButton="搜索"
            @search="onSearch"
          />
        </a-col>
      </a-row>
      <a-row :gutter="48" v-if="projectType!=='YUNPI'">
        <a-col class="flex product-type">
          <a-radio-group v-model="queryParam.goodsType" @change="onChange" button-style="solid">
            <a-radio-button value=""> 全部商品 </a-radio-button>
            <a-radio-button value="origin"> 自有商品 </a-radio-button>
            <a-radio-button value="oms"> 供销商品 </a-radio-button>
          </a-radio-group>
          <div class="tip">注：当供销商品库存为0，或供货价和标牌价变动时，商品自动下架！</div>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="48">
        <a-col :span="12" class="flex">
          <span
            class="status"
            :class="{ 'status--active': stat.value == queryParam.goodsStatus }"
            v-for="stat in stats"
            :key="stat.value"
            @click="onStatusChange(stat.value)"
          >{{ stat.display }}</span
          >
        </a-col>
        <a-col :span="6" class="batch-actions">
          <a-button @click="batchAction('offline', '确定下架商品吗？')">批量下架</a-button>
          <a-button @click="batchAction('online', '确定上架商品吗？')">批量上架</a-button>
        </a-col>
        <a-col :span="6" class="batch-actions">
          <a-upload
            name="file"
            :multiple="true"
            :action="uploadApi"
            :headers="headers"
            :data="uploadData"
            @change="handleChange"
            :showUploadList="isShowUploadList"
          >
            <a-button> <a-icon type="upload" /> 批量导入供货市场商品 </a-button>
          </a-upload>
        </a-col>
      </a-row>
    </div>
    <a-spin :spinning="loading">
      <div>
        <a-row :gutter="48" class="goods">
          <a-col :span="24">
            <a-table
              bordered
              :columns="columns"
              :data-source="goodsList"
              :pagination="false"
              :row-selection="{ selectedRowKeys: selectedGoodsNos, onChange: onSelectChange }"
              rowKey="goodsNo"
              :scroll="{ x: 1300 }"
            ></a-table>
          </a-col>
        </a-row>

        <a-row class="goods" v-if="meta && meta.total > meta.pageSize" type="flex" justify="end">
          <a-col>
            <pagination :total="meta.total" :pageSize="meta.pageSize" show-less-items @change="onPageChange" />
          </a-col>
        </a-row>
      </div>
    </a-spin>
    <a-modal v-model="modalVisible" width="50%" title="修改库存" @ok="updateStock">
      <a-table
        bordered
        :columns="modalTableColum"
        :data-source="[selectedRow]"
        :pagination="false"
        rowKey="goodsNo"
      ></a-table>
    </a-modal>
  </a-card>
</template>

<script>
import goodsApi from '@/api/goods'
import { omsAPI } from '@/utils/request'
import { isNumber } from '@/utils/util'
import { Pagination } from 'ant-design-vue'
import { ACCESS_TOKEN, MESH_NO } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      modalVisible: false,
      isShowUploadList: true,
      projectType: '',
      headers: '',
      uploadData: '',
      uploadApi: omsAPI + '/v1/supply/upload',
      currentStock: 0,
      selectedRow: {},
      selectedIndex: -1,
      queryParam: {
        goodsStatus: 'all',
        goodsType: ''
      },
      filter: 'goodsNo',
      keyword: '',
      pageSize: 10,
      stats: [],
      goodsList: [],
      meta: {},
      loading: false,
      selectedGoodsNos: [],
      // outerColumns: [
      //   {
      //     title: '商品信息',
      //     customRender: (text, row, index) => {
      //       return {
      //         children: (
      //           <a-table
      //             bordered
      //             columns={this.columns}
      //             data-source={[row]}
      //             pagination={false}
      //             rowKey={row => `inner-${row.goodsNo}`}
      //           ></a-table>
      //         )
      //       }
      //     }
      //   }
      // ],
      modalTableColum: [
        {
          title: '商品信息',
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="product">
                  <div>
                    <img class="product__cover" src={row.imageUrl} />
                  </div>
                  <div>
                    <p class="product__info">{row.name}</p>
                  </div>
                </div>
              )
            }
          }
        },
        {
          title: '售价￥',
          width: 50,
          customRender: (text, row, index) => {
            return row.price
          }
        },
        {
          title: '当前库存',
          customRender: (text, row, index) => {
            return row.number
          }
        },
        {
          title: '更改库存',
          customRender: (text, row, index) => {
            return <a-input-number v-model={this.currentStock} />
          }
        }
      ],
      columns: [
        {
          title: '商品信息',
          width: 450,
          key: 'info',
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="product">
                  <div class="product_item">
                    <img class="cover-style" src={row.images[0]} />
                    <p class="product__info product__info_name">{row.name}</p>
                    {row.isOmsGoods ? (
                      <a-tag class="product_tag" color="orange">
                        供销商品
                      </a-tag>
                    ) : (
                      <span class="product_tag"></span>
                    )}
                  </div>
                </div>
              )
            }
          }
        },
        {
          title: '售价￥',
          key: 'price',
          customRender: (text, row, index) => {
            return {
              children: <p class="product__info_pirce">{row.price}</p>
            }
          }
        },
        {
          title: '当前库存',
          key: 'number',
          customRender: (text, row, index) => {
            return {
              children: (
                <div>
                  <div>{row.number}</div>
                </div>
              )
            }
          }
        },
        {
          title: '累积销量',
          key: 'totalSaleCount',
          customRender: (text, row, index) => {
            return row.totalSaleCount
          }
        },
        {
          title: '创建时间',
          key: 'createdAt',
          width: 200,
          customRender: (text, row, index) => {
            return row.createdAt
          }
        },
        {
          title: '操作',
          width: 150,
          key: 'goodsNo',
          fixed: 'right',
          customRender: (text, row, index) => {
            return (
              <div class="flex">
                <div>
                  <router-link to={`/products/${row.goodsNo}`}>编辑</router-link>
                </div>
                <div class="onLine-style">
                  {row.online ? (
                    <a
                      disabled={!row.omsOnline && row.isOmsGoods}
                      onclick={() => this.batchAction('offline', '确定下架商品吗？', [row.goodsNo])}
                    >
                      下架
                    </a>
                  ) : (
                    <a
                      disabled={!row.omsOnline && row.isOmsGoods}
                      onclick={() => this.batchAction('online', '确定上架商品吗？', [row.goodsNo], row.skus)}
                    >
                      上架
                    </a>
                  )}
                </div>
                {!row.online ? (
                  <div>
                    <a onclick={() => this.deleteConfirm(row.goodsNo)}>删除</a>
                  </div>
                ) : (
                  ''
                )}
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    onChange(val) {
      this.queryParam.goodsType = val.target.value
      this.fetchGoodsList()
    },
    async fetchGoodsList() {
      this.loading = true
      try {
        const {
          data: { list, page, meta }
        } = await goodsApi.list({
          ...this.queryParam
        })
        list.forEach((v, i) => {
          v.key = v.goodsNo
        })
        this.goodsList = list
        this.meta = page
        this.stats = meta.statusOptions
      } finally {
        this.loading = false
      }
    },
    onStatusChange(status) {
      this.queryParam.goodsStatus = status
      this.queryParam.page = 1
      this.fetchGoodsList()
    },
    handleChange(info) {
      let res = info.file.response
      if (info.file.status === 'done' && +res.meta.code === 0) {
        this.$message.success('操作成功!')
        this.isShowUploadList = true
      } else if (info.file.status === 'done' && +res.meta.code !== 0) {
        this.$message.error(`${res.meta.message}`)
        this.isShowUploadList = false
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 导入失败`)
        this.isShowUploadList = false
      }
    },
    onPageChange(page) {
      this.queryParam.page = page
      this.fetchGoodsList()
    },
    onSearch(keyword) {
      const params = {
        page: 1,
        goodsStatus: this.queryParam.goodsStatus,
        keyword
      }

      this.queryParam = params
      this.fetchGoodsList()
    },
    openUpdateStockModal(index) {
      this.selectedRow = this.goodsList[index]
      this.selectedIndex = index
      this.currentStock = this.selectedRow.number
      this.modalVisible = true
    },
    async updateStock() {
      if (this.currentStock < 0) {
        this.$message.error('库存不能少于0，请重新输入！')
        return false
      }
      if (this.currentStock % 1 !== 0) {
        this.$message.error('库存必须为整数，请重新输入！')
        return false
      }
      const { resultCode, message, data } = await goodsApi.updateStock(this.selectedRow.goodsNo, this.currentStock)
      if (resultCode > 0) {
        this.$message.error(message)
      } else {
        this.goodsList[this.selectedIndex].number = data.number
        this.$message.success('操作成功')
        this.modalVisible = false
        this.resetSelectedRow()
      }
    },
    resetSelectedRow() {
      this.selectedIndex = -1
      this.selectedRow = {}
    },
    async batchAction(action, title, goodsNos = [], skus = []) {
      let isblank = false
      if (skus.length > 0) isblank = isNumber(skus)
      await new Promise((resolve, reject) => {
        this.$confirm({
          title: isblank ? '该商品库存为0，' + title : title,
          okText: '确认',
          cancelText: '取消',
          onOk: () => resolve(),
          onCancel: () => reject(new Error('去下操作'))
        })
      })
      const { meta } = await goodsApi.bactchAction({
        online: action === 'online',
        goodsNos: goodsNos.length > 0 ? goodsNos : this.selectedGoodsNos
      })
      this.selectedGoodsNos = []
      if (meta.code === 0) {
        this.$message.success('操作成功')
      }
      this.fetchGoodsList()
    },
    onSelectChange(selectedKeys) {
      this.selectedGoodsNos = selectedKeys
    },
    deleteConfirm(id) {
      this.$confirm({
        title: '确认删除该商品吗?',
        onOk: () => this.deleteGoods(id),
        onCancel() {}
      })
    },
    async deleteGoods(goodsNo) {
      await goodsApi.del(goodsNo)
      this.fetchGoodsList()
      this.$message.success('操作成功')
    }
  },
  created() {
    //       let num1 = 0.099
    // let result2 = Math.floor(num1 * 100) / 100
    // console.log(result2, '123')
    this.projectType = process.env.VUE_APP_PROJECT_TYPE
    this.fetchGoodsList()
    this.headers = {
      Authorization: Vue.ls.get(ACCESS_TOKEN)
    }
    let channel =
      process.env.VUE_APP_PROJECT_TYPE === 'YUNPI'
        ? 'yunpi'
        : process.env.VUE_APP_PROJECT_TYPE === 'HOMAHO'
        ? 'homaho'
        : 'gewu'
    this.uploadData = {
      meshNo: Vue.ls.get(MESH_NO),
      channel
    }
  },
  mounted() {
    // this.fetchGoodsList()
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/dist/antd.less';
@import '../orders/style.less';

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
.goods:not(:first-child) {
  margin-top: 20px;
}
.batch-actions > button {
  float: right;
  &:last-child {
    margin-right: 10px;
  }
}
.cover-style {
  width: 50px;
  height: 50px;
}
.input-style {
  margin-bottom: 20px;
}
.product__info_pirce {
  margin: 0;
}
.product__info_name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  height: 63px;
}
.product__info {
  margin: 0 20px;
}
.onLine-style {
  margin: 0 10px;
}
.product__icon {
  width: 70px;
  margin-left: 10px;
  box-sizing: border-box;
  padding: 0 5px;
  border-radius: 12px;
  text-align: center;
  background-color: rgb(255, 157, 0);
}
.product-type {
  display: flex;
  align-items: center;
  .tip {
    margin-left: 20px;
  }
  .ant-radio-button-wrapper {
    margin-right: 20px;
  }
}
</style>
