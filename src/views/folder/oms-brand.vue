<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <div class="hd">
      <div class="h-style" v-if="active===''">请选择品牌：</div>
      <div class="h-style brand" v-else>已选择品牌：{{ active }}</div>
    </div>
    <div class="box">
      <div class="list" v-for="(v,i) in brandList" :key="i" @click="handleBrand(v.brandId)">
        <div class="name">{{ v.name }}</div>
        <div class="icon" :class="v.isActive?'icon_act':''"></div>
      </div>
    </div>
    <div class="btn-box">
      <a-button type="primary" :disabled="active === ''" @click="jumpPage">下一步</a-button>
      <a-button style="margin-left:10px" @click="back">返回上一级</a-button>
    </div>
  </a-card>
</template>

<script>
  import { brandList } from '@/api/goods'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        brandList: [],
        active: '',
        activeBrandList: []
      }
    },
    computed: {
      ...mapGetters(['color'])
    },
    methods: {
      ...mapActions(['setBrand']),
      async getBrandList(category1Id) {
        try {
          const { data } = await brandList({ category1Id })
          data.forEach(v => {
            v.isActive = false
          })
          this.brandList = data
        } finally {
        }
      },
      back() {
        this.$router.back(-1)
      },
      jumpPage() {
        this.setBrand(this.activeBrandList)
        this.$router.push({ name: 'OmsGoods' })
      },
      handleBrand(id) {
        this.brandList.forEach(v => {
          if (v.brandId === id) v.isActive = !v.isActive
        })
        let activeList = this.brandList.filter(item => item.isActive === true)
        let nameList = [ ]
        if (activeList.length > 0) {
          activeList.forEach(v => {
            nameList.push(v.name)
          })
        }
        this.activeBrandList = activeList
        if (nameList.length > 0) {
          this.active = nameList.join('/')
        }
      }
    },
    mounted() {
      let category1Id = this.$route.params.id
      this.getBrandList(category1Id)
    }
  }
</script>

<style scoped lang="less">
  .hd {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .h-style{
      font-weight: 800;
      font-size: 23px;
      margin-right: 20px;
    }
    .brand{
      font-weight: 500;
      font-size: 16px;
      margin-right: 20px;
      word-break: break-all;
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
        >span{
          font-size: 14px;
        }
      }
      .icon{
        width: 34px;
        height: 34px;
        background-image: url('../../assets/oms-icon.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .icon_act{
        background-image: url('../../assets/oms-active-icon.png');
      }
    }
  }
  .btn-box{
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
