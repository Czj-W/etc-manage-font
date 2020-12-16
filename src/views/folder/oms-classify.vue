<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <div class="hd">
      <div class="h-style" v-if="active === ''">请选择一级分类：<span>仅有商品列表未存在的商品</span></div>
      <div class="h-style" v-else>已选择分类：{{ active.name }} <span>仅有商品列表未存在的商品</span></div>
    </div>
    <div class="box">
      <div class="list" v-for="(v, i) in cateList" :key="i" @click="handleClassify(v)">
        <div class="name">
          {{ v.name }} <span>（商品数量 {{ v.goodsNumber }}）</span>
        </div>
        <div class="icon" :class="active.categoryId === v.categoryId ? 'icon_act' : ''"></div>
      </div>
    </div>
    <div class="btn-box">
      <a-button type="primary" :disabled="active === ''" @click="jumpPage">下一步</a-button>
    </div>
  </a-card>
</template>

<script>
  import { cateList } from '@/api/goods'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        cateList: [],
        active: ''
      }
    },
    computed: {
      ...mapGetters(['color'])
    },
    methods: {
      ...mapActions(['setCategory']),
      handleClassify(val) {
        this.active = val
      },
      jumpPage() {
        this.setCategory(this.active)
        this.$router.push({ name: 'OmsBrand', params: { id: this.active.categoryId } })
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
      }
    },
    mounted() {
      this.getCateList()
    }
  }
</script>

<style scoped lang="less">
  .hd {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .h-style {
      font-weight: 800;
      font-size: 23px;
      margin-right: 20px;
      > span {
        margin-left: 8px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c1cad4;
        line-height: 20px;
      }
    }
  }
  .box {
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
    .list {
      width: 100%;
      height: 70px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(209, 207, 207, 0.4);
      padding-left: 10px;
      padding-right: 23px;
      box-sizing: border-box;
      .name {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #001629;
        line-height: 22px;
        > span {
          font-size: 14px;
        }
      }
      .icon {
        width: 34px;
        height: 34px;
        background-image: url('../../assets/oms-icon.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .icon_act {
        background-image: url('../../assets/oms-active-icon.png');
      }
    }
  }
  .btn-box {
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
