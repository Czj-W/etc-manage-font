<template>
  <div>
    <div class="cate">
      <a-card class="cate-card">
        请先选择要设置的分类：
        <a-radio-group
          name="radioGroup"
          :default-value="cateId"
          v-model="cateId"
          class="radioGroup-style"
          @change="onModeChange"
        >
          <a-radio :value="val.id" v-for="val in categories" :key="val.id">{{ val.name }}</a-radio>
        </a-radio-group>
      </a-card>
    </div>
    <div>
      <a-form-model v-bind="formLayout">
        <div class="banners">
          <a-card
            class="banner"
            v-for="(banner, index) in banners"
            :key="index"
            :loading="banner.isCardLoading || false"
          >
            <h2>首页 Banner {{ index + 1 }}</h2>
            <a-form-model-item label="banner名称">
              <a-input v-model="banner.title" placeholder="请输入banner名称" class="input-style" />
            </a-form-model-item>
            <a-form-model-item label="上传图片" class="uploader-form-item">
              <div class="uploader">
                <a-spin :spinning="banner.isLoading || false">
                  <div class="ant-upload ant-upload-select ant-upload-select-picture-card">
                    <span role="button" tabindex="0" class="ant-upload pa">
                      <div class="form-style" @click="selectImage(index, bannerRef(banner.id))"></div>
                      <form :ref="bannersFormRef(banner.id)">
                        <input
                          type="file"
                          :ref="bannerRef(banner.id)"
                          accept="images/*"
                          style="display:none"
                          @change="uploadImage"
                        />
                      </form>
                      <img class="banner-image" v-if="banner.imageUrl" :src="banner.imageUrl" alt="banner" />
                      <a-icon v-else type="plus" />
                      <!---->
                    </span>
                  </div>
                </a-spin>
                <div v-if="banner.id">
                  <a @click="selectImage(index, bannerRef(banner.id))">更换</a>
                </div>
                <div v-else>
                  <a @click="selectImage(index, bannerRef(banner.id))">点击上传</a>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="图片链接到">
              <span v-if="banner.actionData.name" class="goods-name">{{ banner.actionData.name }}</span>
              <a class="link-action" @click="bannerBindGoods(index)">设置</a>
            </a-form-model-item>
            <a-form-model-item
              label="上传列表图"
              class="uploader-form-item"
              v-if="banner.actionData.goodsNo && banner.actionData.goodsNo.length > 1"
            >
              <div class="uploader">
                <a-spin :spinning="banner.isListLoading || false">
                  <div
                    class="ant-upload ant-upload-select ant-upload-select-picture-card"
                    @click="selectLIstImage(index, listImgRef(banner.id))"
                  >
                    <span role="button" tabindex="0" class="ant-upload">
                      <form :ref="listImgFormRef(banner.id)">
                        <input
                          type="file"
                          :ref="listImgRef(banner.id)"
                          accept="images/*"
                          style="display: none;"
                          @change="uploadSubImage"
                        />
                      </form>
                      <img class="banner-image" v-if="banner.subImageUrl" :src="banner.subImageUrl" alt="banner" />
                      <a-icon v-else type="plus" />
                      <!---->
                    </span>
                  </div>
                </a-spin>
                <div v-if="banner.id">
                  <a @click="selectLIstImage(index, listImgRef(banner.id))">更换</a>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="是否确认">
              <a-button @click="submit(index)" type="primary" :loading="btnLoading">确认</a-button>
              <a-button @click="remove(index)">取消</a-button>
            </a-form-model-item>
            <div class="delete-btn">
              <a @click="removeBanner(index)">
                <a-icon class="delete-icon" type="close-circle" />
              </a>
            </div>
          </a-card>
        </div>
        <a-row class="append-row">
          <a-col v-if="banners.length < 9">
            <a @click="appendBanner()">
              <a-icon type="plus-circle" />
              <span class="append-btn">继续添加</span>
            </a>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <a-modal v-model="visible" title="图片链接至" width="50%">
      <a-spin :spinning="isModelLoading">
        <div class="filter-box">
          <div class="select-box">
            选择品牌：
            <a-select v-model="brandId" default-value="" style="width: 120px" @change="handleBrandChange">
              <a-select-option :value="val.id" v-for="(val, index) in brandsList" :key="index">
                {{ val.name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="input-box">
            <a-input v-model="keyword" placeholder="请输入搜索的商品名称" style="width:100%" />
          </div>
          <a-button type="primary" class="input-box" @click="searchGoods">
            搜索
          </a-button>
          <a-button @click="reset">
            重置
          </a-button>
        </div>
        <!-- <a-form-model ref="selectGoodsForm" class="banner_model" v-if="goodsList.length > 0">
          <a-form-model-item prop="goodsNo"> -->
        <!-- <div class="banner_model" v-if="goodsList.length > 0">
          <a-checkbox-group :value="selectGoodsForm.goodsNo" v-model="selectGoodsForm.goodsNo">
            <div class="goods" v-for="(goods, index) in goodsList" :key="index">
              <a-checkbox :value="goods.goodsNo" :defaultChecked="false" @change="handleBoxChange">
                <div class="goods-box">
                  <img class="goods-cover" :src="goods.listPic" />
                  <div class="txt">{{ goods.name }}</div>
                </div>
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </div> -->
        <!-- </a-form-model-item>
        </a-form-model> -->
        <a-form-model :model="selectGoodsForm" ref="selectGoodsForm" class="banner_model" v-if="goodsList.length > 0">
          <a-form-model-item prop="goodsNo">
            <a-checkbox-group v-model="selectGoodsForm.goodsNo">
              <div class="goods" v-for="(goods, index) in goodsList" :key="index">
                <a-checkbox :value="goods.goodsNo" name="goods">
                  <!-- <img :src="`goods.images.length > 0 ? goods.images[0] : ''`" /> -->
                  <div class="goods-box">
                    <img class="goods-cover" :src="goods.listPic" />
                    <div class="txt">{{ goods.name }}</div>
                  </div>
                </a-checkbox>
              </div>
            </a-checkbox-group>
          </a-form-model-item>
        </a-form-model>
        <div class="model-txt" v-else-if="goodsList.length === 0 && isShowTxt">
          查询不到相应商品，试试更换「品牌」或「商品名称」
        </div>
      </a-spin>
      <template slot="footer">
        <a-button key="back" @click="nextPage" :disabled="goodsList.length === totalGoodsList.length">
          下一页
        </a-button>
        <a-button key="submit" type="primary" @click="selectedGoods">
          确定
        </a-button>
      </template></a-modal
    >
  </div>
</template>

<script>
import Vue from 'vue'
import bannersApi from '@/api/banner'
import brandApi from '@/api/brand'
import goodsApi from '@/api/goods'
import categoryApi from '@/api/category'
import upyun from '@/utils/upyun'

export default {
  data() {
    return {
      btnLoading: false,
      isModelLoading: false,
      isShowTxt: false,
      name: '',
      brandId: '',
      formLayout: {
        labelCol: { md: { span: 2 }, sm: { span: 6 } },
        wrapperCol: { md: { span: 18 }, sm: { span: 18 } }
      },
      keyword: '',
      uploading: false,
      visible: false,
      banners: [],
      goodsList: [], // 显示的商品池
      totalGoodsList: [], // 总商品池
      constantGoodsList: [],
      brandsList: [], // 显示的品牌
      cateId: 0,
      categories: [],
      page: 1,
      selectedBannerIndex: -1,
      selectedImgIndex: -1,
      selectGoodsForm: {
        goodsNo: []
      }
    }
  },
  computed: {
    goodsName() {
      let goods
      const list = []
      let that = this
      if (this.selectGoodsForm.goodsNo.length > 0) {
        this.selectGoodsForm.goodsNo.forEach(v => {
          goods = that.constantGoodsList.find(it => it.goodsNo === v)
          list.push(goods.name || '')
        })
      }
      const goodsName = list.join(',')
      return goodsName || ''
    }
  },
  mounted() {
    this.fetchBanners()
    this.searchGoods()
    this.fetchCategories()
    this.getBrands()
  },
  methods: {
    handleBoxChange(e) {
      let list = this.selectGoodsForm.goodsNo || []
      let idx = list.indexOf(e.target.value)
      if (idx === -1) {
        this.selectGoodsForm.goodsNo.push(e.target.value)
      } else {
        this.selectGoodsForm.goodsNo.splice(idx, 1)
      }
    },
    handleBrandChange(e) {
      this.searchGoods()
    },
    onModeChange(e) {
      this.keyword = ''
      this.brandId = ''
      this.selectGoodsForm.goodsNo = []
      this.fetchBanners()
      this.getBrands()
      this.searchGoods()
    },
    setGoodList(num, val) {
      let idx = num * 10 - 1
      if (val.length > idx) {
        this.page = num
      }
      this.goodsList = val.filter((item, i) => i <= idx)
      this.isShowTxt = this.goodsList.length === 0
      this.isModelLoading = false
    },
    async fetchBanners() {
      const { data } = await bannersApi.listByCate({ category_id: this.cateId })
      if (data.banners.length > 0) {
        data.banners.forEach(v => {
          v.actionData.goodsNo = v.actionData.goodsNo.split(',')
          v.subImageUrl = v.originSubImageUrl ? v.subImageUrl : ''
          v.subImage = v.originSubImageUrl || ''
        })
        this.banners = data.banners
      } else {
        this.banners = []
        this.appendBanner(null)
      }
    },
    async fetchGoodsions() {
      this.isModelLoading = true
      const { data } = await categoryApi.products({ id: this.cateId || '', brandId: this.brandId })
      this.totalGoodsList = data
      this.constantGoodsList = data
      // console.log(this.constantGoodsList, 456)
      this.setGoodList(this.page, data)
    },
    async getBrands() {
      const { data } = await brandApi.list({ categoryId: this.cateId || '' })
      this.brandsList = [{ id: '', name: '全部' }, ...data]
    },
    reset() {
      this.brandId = ''
      this.keyword = ''
      this.searchGoods()
    },
    async searchGoods() {
      // if (this.keyword.trim() === '') {
      //   this.$message.warning('请输入搜索的商品名称！')
      //   return
      // }
      this.isModelLoading = true
      this.page = 1
      // this.selectGoodsForm.goodsNo = []
      const { data } = await goodsApi.searchGoods({ keyword: this.keyword, brandId: this.brandId, categoryId: this.cateId || '' })
      this.totalGoodsList = data
      this.constantGoodsList = data
      this.setGoodList(this.page, data)
    },
    appendBanner(url = null) {
      this.banners.push({
        imageUrl: url,
        actionData: {}
      })
    },
    async removeBanner(index) {
      Vue.set(this.banners[index], 'isCardLoading', true)
      const banner = this.banners[index]
      if (banner.id) {
        await this.deleteBanner(banner.id)
      }
      this.banners[index].isCardLoading = false
      this.banners.splice(index, 1)
    },
    async deleteBanner(id) {
      await bannersApi.delByCate(id)
      this.$message.success('删除成功')
    },
    async fetchCategories() {
      const { data } = await categoryApi.list()
      this.categories = [{ id: 0, name: '全部' }, ...data.categories]
    },
    nextPage() {
      this.visible = true
      let page = this.page + 1
      this.setGoodList(page, this.totalGoodsList)
    },
    selectedGoods() {
      const actionData = this.banners[this.selectedBannerIndex].actionData
      actionData.goodsNo = this.selectGoodsForm.goodsNo
      actionData.name = this.goodsName
      this.banners[this.selectedBannerIndex].actionData = actionData
      this.closeModal()
    },
    bannerBindGoods(index) {
      this.selectedBannerIndex = index
      this.selectGoodsForm.goodsNo = this.banners[index].actionData.goodsNo || []
      this.visible = true
    },
    closeModal() {
      this.$refs.selectGoodsForm.resetFields()
      // this.selectedBannerIndex = -1
      this.visible = false
    },
    async selectImage(index, ref) {
      if (this.banners[index].isLoading) return
      event.stopPropagation()
      this.selectedBannerIndex = index
      this.$refs[ref][0].click()
    },
    async selectLIstImage(index, ref) {
      if (this.banners[index].isListLoading) return
      event.stopPropagation()
      this.selectedImgIndex = index
      this.$refs[ref][0].click()
    },
    async uploadSubImage(e) {
      Vue.set(this.banners[this.selectedImgIndex], 'isListLoading', true)
      const banner = this.banners[this.selectedImgIndex]
      try {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        const url = await upyun.upload(formData)

        banner.subImage = url
        banner.subImageUrl = upyun.url(url)
        this.$forceUpdate()
        this.banners[this.selectedImgIndex].isListLoading = false
      } finally {
        this.banners[this.selectedImgIndex].isListLoading = false
        this.$refs[this.listImgFormRef(banner.id)][0].reset()
      }
    },
    async uploadImage(e) {
      Vue.set(this.banners[this.selectedBannerIndex], 'isLoading', true)
      event.stopPropagation()
      const banner = this.banners[this.selectedBannerIndex]
      try {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        const url = await upyun.upload(formData)

        banner.image = url
        banner.imageUrl = upyun.url(url)
        this.$forceUpdate()
        this.banners[this.selectedBannerIndex].isLoading = false
      } finally {
        this.banners[this.selectedBannerIndex].isLoading = false
        this.$refs[this.bannersFormRef(banner.id)][0].reset()
      }
    },
    bannersFormRef(id) {
      return `banner-${id}-form`
    },
    bannerRef(id) {
      return `banner-${id}`
    },
    listImgFormRef(id) {
      return `img-${id}-form`
    },
    listImgRef(id) {
      return `img-${id}`
    },
    async submit(index) {
      const banner = this.banners[index]
      if (!banner.imageUrl) {
        this.$message.warning('请上传图片')
        return
      }
      if (banner.actionData.goodsNo === undefined || banner.actionData.goodsNo.length === 0) {
        this.$message.warning('请设置图片链接')
        return
      }
      if (!banner.title) {
        this.$message.warning('请输入banner名称')
        return
      }
      if (banner.actionData.goodsNo.length > 1 && !banner.subImageUrl) {
        this.$message.warning('请上传列表图')
        return
      }
      if (banner.id) {
        this.btnLoading = true
        const { data, meta } = await bannersApi.updateByCate(banner.id, {
          title: banner.title || '',
          image: banner.image,
          sub_image: banner.subImage,
          goodsNo: banner.actionData.goodsNo.join(',')
        })
        data.subImageUrl = data.originSubImageUrl ? data.subImageUrl : ''
        data.subImage = data.originSubImageUrl || ''
        data.actionData.goodsNo = data.actionData.goodsNo.split(',')
        this.banners[index] = data
        if (meta.code === 0) {
          this.$message.success('更新成功')
          this.btnLoading = false
        } else {
          this.btnLoading = false
        }
      } else {
        this.btnLoading = true
        const { data, meta } = await bannersApi.createByCate({
          title: banner.title,
          image: banner.image,
          imageUrl: banner.imageUrl,
          goodsNo: banner.actionData.goodsNo.join(','),
          sub_image: banner.subImage,
          category_id: this.cateId
        })
        data.subImageUrl = data.originSubImageUrl ? data.subImageUrl : ''
        data.actionData.goodsNo = data.actionData.goodsNo.split(',')
        data.subImage = data.originSubImageUrl || ''
        this.banners[index] = data
        this.banners = this.banners.slice()
        if (meta.code === 0) {
          this.$message.success('更新成功')
          this.btnLoading = false
        } else {
          this.btnLoading = false
        }
      }
    },
    remove(index) {
      const banner = this.banners[index]
      if (banner.id) {
        this.fetchBanners()
      } else {
        this.banners.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pa {
  position: relative;
  .form-style {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
  }
}
.uploader-form-item {
  display: flex;
  align-items: center;
}
.uploader {
  display: flex;
  align-items: center;
}
.avatar-uploader {
  width: unset;
}
.append-row {
  font-size: 18px;
  margin-top: 10px;
  text-align: center;
}
.append-btn {
  margin-left: 10px;
}
.banner:not(:first-child) {
  margin-top: 20px;
}
.delete-btn {
  position: absolute;
  height: 40px;
  width: 40px;
  font-size: 24px;
  top: -16px;
  right: -25px;
  z-index: 1;
}
.delete-icon {
  background: #fff;
  border-radius: 50%;
}
.goods {
  padding: 5px;
  width: 100%;
  display: flex;
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
  .goods-box {
    width: 100%;
    display: flex;
    align-items: center;
    .txt {
      flex: 1;
    }
  }
}
.goods-cover {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}
.ant-form-item-children {
  width: 100%;
  display: block;
}
.ant-checkbox-group {
  display: block;
}
.ant-checkbox-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}
.link-action {
  margin-left: 8px;
}
.upload {
  display: table-cell;
  width: 100%;
  height: 100%;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}
.banner-image {
  width: 100%;
}
.input-style {
  width: 30%;
}
.cate-card {
  margin-bottom: 20px;
}
.banner_model {
  height: 500px;
  overflow-y: auto;
}
.filter-box {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.model-txt {
  width: 100%;
  text-align: center;
  color: #8f9194;
}
.select-box,
.input-box {
  margin-right: 20px;
}
</style>
