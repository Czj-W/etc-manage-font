<template>
  <a-card class="floder-container">
    <div class="table-page-search-wrapper">
      <div class="condition">
        <div class="input-style">
          <a-input-search placeholder="请输入商品名称/关键字" enter-button="搜索" @search="onSearch" />
        </div>
        <div class="select-style">
          <span>分类：</span>
          <cascader
            :options="cateList"
            change-on-select
            expandTrigger="hover"
            :field-names="{ label: 'newName', value: 'categoryId', children: 'children' }"
            placeholder="请选择分类"
            @change="onChange"
          />
        </div>
        <div class="select-style">
          <span>品牌：</span>
          <a-select
            style="width: 160px"
            allowClear
            show-search
            placeholder="请选择品牌"
            @blur="handleBlur"
            @popupScroll="handlePopupScroll"
            @change="handleChange"
            @search="fetchUser"
            :filter-option="false"
            :defaultValue="parameter.brandId"
            :value="parameter.brandId"
          >
            <a-select-option
              v-for="brand in selectBrandList"
              :value="brand.brandId"
              :key="brand.brandId"
            >{{ brand.name }}</a-select-option>
          </a-select>
        </div>
      </div>
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 6 }"
        :loading="listLoading"
        :data-source="goodsList"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <router-link target="_blank" :to="{ name: 'FolderDetail', params: { id: item.goodId } }" class="list">
            <a-card hoverable>
              <img slot="cover" :src="item.coverPicture" />
              <div class="name">{{ item.name }}</div>
              <div class="price">
                成本价：
                <span>￥{{ item.minOmsPrice }}</span>
              </div>
              <div class="price">
                利润：
                <span>{{ item.maxOmsProfit }}</span>
              </div>
            </a-card>
          </router-link>
        </a-list-item>
      </a-list>
      <div class="pagination-style">
        <div></div>
        <pagination
          show-quick-jumper
          :default-current="1"
          :total="pagination.total"
          :defaultPageSize="pagination.pageSize"
          @change="onChangePage"
        />
      </div>
    </div>
  </a-card>
</template>

<script>
  import { Cascader, Pagination } from 'ant-design-vue'
  import { brandList, cateList, goodsList } from '@/api/goods'
  // import { delete } from 'vuedraggable'

  export default {
    components: {
      Cascader,
      Pagination
    },
    data() {
      return {
        listLoading: false,
        page: 1,
        size: 18,
        parameter: {
          brandId: undefined
        },
        cateList: [],
        brandList: [],
        selectBrandList: [],
        goodsList: [],
        pagination: {
          total: 0,
          pageSize: 18
        },
        form: {},
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                  {
                    value: 'xihu',
                    label: 'West Lake'
                  }
                ]
              }
            ]
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    mounted() {
      this.getGoodsList()
      this.getCateList()
      this.getBrandList()
    },
    methods: {
      onChangePage(page) {
        this.page = page
        this.getGoodsList()
      },
      async getGoodsList() {
        this.listLoading = true
        try {
          const { data } = await goodsList({
            page: this.page || 1,
            size: this.size || 18,
            ...this.parameter
          })
          this.goodsList = data.list
          if (data.page && data.page.total) data.page.total = Number(data.page.total)
          if (data.page && data.page.pageSize) data.page.pageSize = Number(data.page.pageSize)
          this.pagination.total = data.page.total
        } finally {
          this.listLoading = false
        }
      },
      async getBrandList() {
        try {
          const { data } = await brandList(this.parameter)
          this.brandList = data
          if (this.brandList.length > 50) {
            this.selectBrandList = this.brandList.slice(0, 50)
          } else {
            this.selectBrandList = this.brandList
          }
        } finally {
        }
      },
      async getCateList() {
        try {
          const { data } = await cateList()
          data.forEach((v) => {
            v.newName = `${v.name} (${v.goodsNumber})`
            v.children.map((item) => {
              item.newName = `${item.name} (${item.goodsNumber})`
            })
          })
          this.cateList = data
        } finally {
        }
      },
      onSearch(val) {
        this.parameter.keyword = val
        this.getGoodsList()
      },
      handleBlur() {
        this.selectBrandList = this.brandList.slice(0, 50)
      },
      fetchUser(val) {
        let data_ = this.brandList.filter((item) => item.name.indexOf(val) > -1)
        if (data_.length > 100 || val === '') {
          data_ = data_.slice(0, 100)
        }
        this.selectBrandList = data_
      },
      handlePopupScroll(e) {
        const { target } = e
        const rmHeight = target.scrollHeight - target.scrollTop
        const clHeight = target.clientHeight
        const curLen = this.selectBrandList.length
        const allLen = this.brandList.length
        if (rmHeight === clHeight) {
          if (curLen + 100 < allLen) {
            const newArr = this.brandList.slice(curLen, curLen + 100)
            this.selectBrandList = this.selectBrandList.concat(newArr)
          } else {
            const newArr = this.brandList.slice(curLen, allLen)
            this.selectBrandList = this.selectBrandList.concat(newArr)
          }
        }
      },
      onChange(val) {
        const length = val.length
        switch (length) {
          case 0:
            delete this.parameter.category1Id
            delete this.parameter.category2Id
            break
          case 1:
            this.parameter.category1Id = val[0]
            this.parameter.category2Id = ''
            break
          case 2:
            this.parameter.category1Id = val[0]
            this.parameter.category2Id = val[1]
            break
          default:
            break
        }
        this.parameter.brandId = undefined
        this.getBrandList()
        this.getGoodsList()
      },
      handleChange(val) {
        this.parameter.brandId = val
        this.getGoodsList()
        console.log(val)
      }
    }
  }
</script>

<style lang="less">
  .ant-form-item-control {
    width: 50%;
  }
</style>
<style lang="less" scoped>
  .condition {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .input-style {
      width: 20%;
      margin-right: 20px;
    }
    .select-style {
      margin-right: 20px;
    }
  }
  .list {
    width: 200px;
    height: auto;
    margin-right: 20px;
    margin-bottom: 20px;
    color: rgb(41, 42, 43);
    .goods-img {
      width: 200px;
      height: 200px;
      margin-bottom: 10px;
    }
    .name {
      width: 100%;
      height: 42px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin-bottom: 5px;
    }
    .price {
      margin-bottom: 5px;
      > span {
        color: rgb(241, 37, 37);
      }
    }
  }
  .pagination-style {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
