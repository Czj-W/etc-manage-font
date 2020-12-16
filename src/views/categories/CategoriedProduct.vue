<template>
  <div>
    <a-row>
      <a-col :span="16">
        <a-input-search placeholder="输入商品名称，可对单项商品进行分类管理" enter-button="搜索" @search="onSearch" />
      </a-col>
    </a-row>
    <a-row>
      <a-col class="categories">
        <div class="status-header">分类状态</div>
        <div
          class="status"
          :class="{'status--active': stat.value == queryParams.status}"
          v-for="stat in stats"
          :key="stat.value"
          @click="onStatusChange(stat.value)"
        >{{ stat.display }}</div>
        <div class="batch-category">
          <a-button type="primary" ghost @click="openSelectCategoryModal">批量分类</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <a-table
          bordered
          ref="table"
          :row-selection="{ selectedRowKeys: selectedGoodsIDs, onChange: onSelectChange }"
          :columns="columns"
          rowKey="goodsNo"
          :dataSource="goodsList"
          :pagination="false"
          :scroll="{ x: 1500}"
        ></a-table>
      </a-col>
    </a-row>
    <a-row class="goods" v-if="page.total > page.pageSize">
      <a-col :span="24">
        <pagination
          :total="page.total"
          :pageSize="page.pageSize"
          show-less-items
          @change="onPageChange"
        />
      </a-col>
    </a-row>
    <a-modal
      v-model="selectCategoryModalVisible"
      :title="modalTitle"
      ok-text="确认"
      cancel-text="取消"
      @ok="selectCategory"
    >
      <a-form-model :model="categoryForm" ref="categoryForm">
        <a-form-model-item prop="categoryIDs">
          <a-checkbox-group v-model="categoryForm.categoryIDs" @change="test">
            <a-row>
              <div style="margin-bottom:10px" v-for="category in categories" :key="category.id">
                <a-checkbox :value="category.id" name="category">{{ category.name }}</a-checkbox>
              </div>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import goodsApi from '@/api/goods'
  import categoryApi from '@/api/category'
  import { Pagination } from 'ant-design-vue'

  export default {
    components: {
      Pagination
    },
    data() {
      return {
        modalTitle: '',
        selectCategoryModalVisible: false,
        stats: [
          { display: '全部', value: 'all' },
          { display: '未分类', value: 'unsorted' },
          { display: '已分类', value: 'sorted' }
        ],
        goodsList: [],
        meta: {},
        page: {},
        categories: [],
        queryParams: {
          status: 'all',
          keyword: '',
          page: 1
        },
        categoryForm: {
          categoryIDs: []
        },
        selectedGoodsIndex: -1,
        selectedGoodsIDs: [],
        columns: [
          {
            title: '商品信息',
            customRender: (text, row, index) => {
              return {
                children: (
                  <div class="product">
                    <img src={row.images[0]} />
                    <div class="name">{row.name}</div>
                  </div>
                )
              }
            }
          },
          {
            title: '规格',
            customRender: (text, row, index) => {
              const keys = Object.keys(row.specifications)
              if (keys.length === 0) {
                return {
                  children: (
                    <div>--</div>
                  )
                }
              } else {
                return {
                  children: (
                    <div>
                      {keys.map((key) => (
                        <p key={key}>
                          <span>{key}：</span>
                          {row.specifications[key].map((it) => it.value).join('、')}
                        </p>
                      ))}
                    </div>
                  )
                }
              }
            }
          },
          {
            title: '商品售价',
            customRender: (text, row, index) => {
              return {
                children: <div>￥{row.price}</div>
              }
            }
          },
          {
            title: '分类状态',
            customRender: (text, row, index) => {
              return {
                children: <div>{row.productCategories.length === 0 ? '未分类' : '已分类'}</div>
              }
            }
          },
          {
            title: '当前分类',
            customRender: (text, row, index) => {
              return {
                children: (
                  <div>
                    {row.productCategories.length === 0 ? '-' : row.productCategories.map((it) => it.name).join('/')}
                  </div>
                )
              }
            }
          },
          {
            title: '分类商品',
            width: 100,
            fixed: 'right',
            customRender: (text, row, index) => {
              return {
                children: <a onclick={() => this.editCategory(index)}>编辑分类</a>
              }
            }
          }
        ]
      }
    },
    mounted() {
      this.fetchGoodsList()
      this.fetchCategories()
    },
    watch: {
      queryParams: {
        handler: function () {
          this.fetchGoodsList()
        },
        deep: true
      }
    },
    methods: {
      test(e) {

      },
      onSearch(keyword) {
        this.queryParams.keyword = keyword
        this.fetchGoodsList()
      },
      onPageChange(page) {
        this.queryParams.page = page
        this.fetchGoodsList()
      },
      onStatusChange(status) {
        this.queryParams.status = status
      },
      onSelectChange(selectedRowKeys) {
        this.selectedGoodsIDs = selectedRowKeys
      },
      async fetchCategories() {
        const { data } = await categoryApi.list()
        this.categories = data.categories
      },
      async fetchGoodsList() {
        const { data } = await goodsApi.categoriedList(this.queryParams)
        // console.log(data)
        this.goodsList = data.list
        this.page = data.page
        this.meta = data.meta
      },
      batchEditCategory() {
        this.modalTitle = '批量编辑分类'
        let categoryIDs = []
        for (const goods of this.goodsList) {
          if (this.selectedGoodsIDs.indexOf(goods.goodsNo) > -1) {
            categoryIDs = categoryIDs.concat(goods.productCategories.map((it) => it.id))
          }
        }
        if (categoryIDs.length > 0) {
          categoryIDs = [...new Set(categoryIDs)]
        }
        this.categoryForm.categoryIDs = categoryIDs
        this.selectCategoryModalVisible = true
      },
      editCategory(index) {
        this.fetchCategories()
        this.selectedGoodsIndex = index
        this.selectedGoodsIDs = [this.goodsList[index].goodsNo]
        this.modalTitle = '编辑分类'
        this.categoryForm.categoryIDs = this.goodsList[index].productCategories.map((it) => it.id)
        this.selectCategoryModalVisible = true
      },
      async selectCategory() {
        try {
          await goodsApi.batchUpdateCategory(this.categoryForm.categoryIDs, this.selectedGoodsIDs)

          this.selectedGoodsIDs = []

          this.$refs.categoryForm.resetFields()
          this.selectCategoryModalVisible = false
          this.fetchGoodsList()
          this.$message.success('操作成功')
        } catch (e) {
          this.$message.error(e.message)
        }
      },
      openSelectCategoryModal() {
        if (this.selectedGoodsIDs.length > 0) {
          this.batchEditCategory()
          this.selectCategoryModalVisible = true
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~ant-design-vue/dist/antd.less';
  .goods {
    margin-top: 20px;
  }
  .status {
    cursor: pointer;
    margin-left: 20px;
    border-bottom: 2px solid transparent;
    &:hover {
      .status--active;
    }
    &::selection {
      background: none;
    }
  }
  .status--active {
    color: @primary-color;
    border-bottom-color: @primary-color;
  }
  .product {
    display: flex;
    align-items: center;
    & > img {
      width: 75px;
      height: 75px;
      margin-right: 10px;
    }
    .name {
      flex: 1;
    }
  }
  .statys-header {
    border-bottom: 2px solid transparent;
  }
  .categories {
    display: flex;
    align-items: center;
    height: 60px;
  }
  .batch-category {
    margin-left: 40px;
  }
</style>
