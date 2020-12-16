<template>
  <a-card>
    <a-tabs type="card">
      <a-tab-pane key="manage" tab="分类管理">
        <CategoryManage />
      </a-tab-pane>
      <a-tab-pane key="productCategory" tab="商品分类管理">
        <CategoriedProduct />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import CategoryManage from '@/views/categories/Manage'
import CategoriedProduct from '@/views/categories/CategoriedProduct'
export default {
  components: {
    CategoryManage,
    CategoriedProduct
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
</style>
