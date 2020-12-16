<template>
  <a-card>
    <a-row>
      <a-col>
        <span>共查询到 {{ goodsList.length }} 商品</span>
      </a-col>
    </a-row>

    <a-row>
      <a-col>
        <a-table bordered :columns="columns" :dataSource="goodsList" rowKey="goodsNo"></a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import categoryApi from '@/api/category'
import goodsApi from '@/api/goods'

export default {
  data() {
    return {
      goodsList: [],
      category: {},
      columns: [
        {
          title: '#',
          customRender: (text, row, index) => {
            return index + 1
          }
        },
        {
          title: '商品信息',
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="product">
                  <img src={row.listPic} />
                  <span>{row.name}</span>
                </div>
              )
            }
          }
        },
        {
          title: '商品售价',
          customRender: (text, row, index) => {
            return {
              children: <span>￥{row.price}</span>
            }
          }
        },
        {
          title: '分类状态',
          customRender: (text, row, index) => {
            return {
              children: <span>{row.hasCategory ? '已分类' : '未分类'}</span>
            }
          }
        },
        {
          title: '当前分类',
          customRender: (text, row, index) => {
            return {
              children: <span>{this.category.name}</span>
            }
          }
        },
        {
          title: '调整顺序',
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="sort">
                  {index > 0 ? <a onclick={() => this.moveUp(index)}>上移</a> : <span>上移</span>}
                  {index < this.goodsList.length - 1 ? (
                    <a onclick={() => this.moveDown(index)}>下移</a>
                  ) : (
                    <span>下移</span>
                  )}
                </div>
              )
            }
          }
        },
        {
          title: '操作',
          customRender: (text, row, index) => {
            return {
              children: (
                <div>
                  <a onclick={() => this.unbindProductConfirm(row.goodsNo)}>取消分类</a>
                </div>
              )
            }
          }
        }
      ]
    }
  },
  mounted() {
    this.category.name = this.$route.query.name || '-'
    this.fetchGoodsList()
    // this.fetchCategory()
  },
  methods: {
    async fetchGoodsList() {
      const { data } = await categoryApi.products({ id: this.$route.params.id, brandId: '' })
      this.goodsList = data
    },
    async fetchCategory() {
      const { data } = await categoryApi.show(this.$route.params.id)
      this.category = data
    },
    unbindProductConfirm(goodsNo) {
      this.$confirm({
        title: '确认删除该商品吗?',
        onOk: () => this.unbindProduct(goodsNo),
        onCancel() {}
      })
    },
    async unbindProduct(goodsNo) {
      await categoryApi.unbindProduct(this.$route.params.id, goodsNo)
      await this.fetchGoodsList()
      this.$message.success('操作成功')
    },
    async moveUp(index) {
      await goodsApi.sort(this.goodsList[index].goodsNo, this.goodsList[index - 1].goodsNo)
      this.fetchGoodsList()
    },
    async moveDown(index) {
      await goodsApi.sort(this.goodsList[index].goodsNo, this.goodsList[index + 1].goodsNo)
      this.fetchGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
.product {
  & > img {
    width: 75px;
    margin-right: 10px;
  }
}
.sort > :not(:first-child) {
  margin-left: 10px;
}
</style>
