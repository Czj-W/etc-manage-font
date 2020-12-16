<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <div class="goods-info">
        <div class="img-box">
          <img class="img" :src="curePicture" alt />
          <div class="img-list">
            <div class="left" @click="clickLeft">《</div>
            <div class="box">
              <div class="box-imgList" :style="`left:${position}px`">
                <img class="image" v-for="imgItem in goodInfo.listPicture" :src="imgItem" :key="imgItem" alt />
              </div>
            </div>
            <div class="right" @click="clickRight">》</div>
          </div>
        </div>
        <div class="info-box">
          <div class="title">{{ goodInfo.name }}</div>
          <div class="price-box">
            <div class="con">
              利润比：
              <span class="red">{{
                goodInfo.minOmsProfit === goodInfo.maxOmsProfit
                  ? goodInfo.maxOmsProfit
                  : `${goodInfo.minOmsProfit} ~ ${goodInfo.maxOmsProfit}`
              }}</span>
            </div>
            <div class="con">
              建议零售价：
              <span
              >{{
                goodInfo.minRetailPrice === goodInfo.maxRetailPrice
                  ? '￥' + goodInfo.maxRetailPrice
                  : `¥${goodInfo.minRetailPrice} ~ ¥${goodInfo.maxRetailPrice}`
              }}（吊牌价）</span
              >
            </div>
            <div class="con">
              成本价：
              <span>{{
                goodInfo.minOmsPrice === goodInfo.maxOmsPrice
                  ? '￥' + goodInfo.maxOmsPrice
                  : `¥${goodInfo.minOmsPrice} ~ ¥${goodInfo.maxOmsPrice}`
              }}</span>
            </div>
          </div>
          <div class="item">运费：包邮</div>
          <div class="item">
            总库存：
            <span>{{ goodInfo.totalStock || 0 }}</span
            >件
          </div>
          <div class="skus-box">
            <div class="name">规格：</div>
            <div class="list">
              <div class="con" v-for="(item_sku, index) in goodInfo.skuList" :key="index">
                <div class="sku">{{ item_sku.skuText || '' }}</div>
                <div class="price">{{ item_sku.omsPrice }}元</div>
                <div class="num">{{ item_sku.stock }}件可售</div>
              </div>
            </div>
          </div>

          <a-button @click="submitGoods" :loading="loading" type="primary" v-if="!isExists">铺货到{{ title }}</a-button>
          <a-button :loading="loading" type="primary" v-if="isExists" @click="jumpList">查看供货商品</a-button>
        </div>
      </div>
      <div class="goods-detail">
        <div class="title">商品详情</div>
        <div class="img-con">
          <img class="imgs" v-for="imgItem in goodInfo.listPicture" :src="imgItem" :key="imgItem" alt />
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { goodInfo, omsGoods, selected } from '@/api/goods'
export default {
  data() {
    return {
      title: '',
      loading: false,
      goodInfo: {
        listPicture: []
      },
      position: 0,
      // num: 5,
      target: 1,
      isExists: false
    }
  },
  created() {
    this.getGoodInfo()
    this.showConfirm()
    this.title = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '云批' : '格子圈'
  },
  computed: {
    curePicture() {
      return this.goodInfo.listPicture[this.target - 1]
    },
    num() {
      return this.goodInfo.listPicture.length
    }
  },
  methods: {
    async getGoodInfo() {
      try {
        const { data } = await goodInfo({
          goodId: this.$route.params.id
        })
        data.skuList.forEach(item => {
          var str = ''
          item.contentList.forEach(content => {
            str += `${content.name}:${content.value}   `
          })
          item.skuText = str
        })
        this.goodInfo = data
      } finally {
      }
    },
    clickLeft() {
      if (this.target < this.num) {
        this.position = -(this.target * 110)
        this.target = this.target + 1
      } else {
        this.position = 0
        this.target = 1
      }
    },
    jumpList() {
      this.$router.push({ name: 'ProductsIndex' })
    },
    clickRight() {
      this.target -= 1
      if (this.target <= 1) {
        this.position = 0
        this.target = 1
      } else {
        this.position = this.position + 110
      }
    },
    async submitGoods() {
      const that = this
      this.loading = true
      const { data } = await omsGoods({
        omsGoodsId: this.$route.params.id
      })
      this.loading = false
      if (data.goodsNo) {
        this.$confirm({
          title: `铺货到${that.title}铺`,
          content: `您已成功将该商品铺货到${that.title}，成功铺货到${that.title}的商品默认为下架状态，需手动编辑后上架，是否现在编辑上架？`,
          okText: '编辑上架',
          cancelText: '继续铺货',
          onOk() {
            that.$router.push({ name: 'ProductsUpdate', params: { id: data.goodsNo } })
          },
          onCancel() {
            // that.$router.go(-1)
            window.location.href = 'about:blank'
            window.close()
          }
        })
      }
    },
    async showConfirm() {
      this.loading = true
      const that = this
      try {
        const { data } = await selected({
          omsGoodsId: this.$route.params.id
        })
        if (data.hasOwnProperty('isExists') && !data.isExists) {
          that.isExists = false
        } else {
          that.isExists = true
          // that.$message.error('商品已存在')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less"></style>
<style lang="less" scoped>
.goods-info {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  .img-box {
    width: 360px;
    margin-right: 20px;
    .img {
      width: 100%;
      height: 360px;
      margin-bottom: 10px;
    }
    .img-list {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100px;
      .left,
      .right {
        cursor: pointer;
        width: 50px;
        height: 100%;
        text-align: center;
        line-height: 100px;
        background-color: chocolate;
      }
      .box {
        width: 260px;
        height: 100px;
        overflow: hidden;
        position: relative;
        .box-imgList {
          position: absolute;
          left: 0;
          top: 0;
          width: 1000%;
          transition: all 0.5s ease 0.1s;
          .image {
            width: 100px;
            height: 100px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .info-box {
    width: 100%;
    .title {
      width: 100%;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 10px;
    }
    .price-box {
      width: 100%;
      background-color: rgb(233, 233, 233);
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .con {
        width: 100%;
        margin-bottom: 5px;
        font-size: 14px;
        color: rgb(139, 139, 139);
        > span {
          color: rgb(41, 42, 43);
          font-size: 16px;
        }
        .red {
          color: rgb(241, 37, 37);
        }
      }
    }
    .item {
      margin-bottom: 10px;
      color: rgb(41, 42, 43);
      > span {
        color: rgb(241, 37, 37);
      }
    }
    .skus-box {
      width: 100%;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      display: flex;
      margin-bottom: 10px;
      .name {
        color: rgb(41, 42, 43);
      }
      .list {
        flex: 1;
        .con {
          width: 100%;
          display: flex;
          align-items: center;
          .sku,
          .price,
          .num {
            width: 200px;
          }
        }
      }
    }
  }
}
.goods-detail {
  width: 100%;
  .title {
    width: 100%;
    background-color: rgb(224, 224, 224);
    color: rgb(41, 42, 43);
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    margin-bottom: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .img-con{
    width: 60%;
    margin:  0 auto;
    .imgs{
      width: 100%;
    }
  }
}
</style>
