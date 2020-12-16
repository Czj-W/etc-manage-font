<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <div class="hd">
      <div class="item">已选分类：{{ category.name || '' }}</div>
      <div class="item">已选品牌：{{ brandName }}</div>
      <!-- <div class="item">包含商品数量：83897249</div> -->
    </div>
    <a-divider />
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="cate" label="请选择需要上架到的店铺分类：" prop="cate">
        <a-select v-model="form.cate" placeholder="请选择分类">
          <a-select-option :value="val.name" v-for="(val, idx) in categories" :key="idx">{{
            val.name
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="price" label="设置售价" prop="price">
        <a-radio-group v-model="form.price" style="width: 100%">
          <a-radio value="0" :style="radioStyleBorder">使用建议零售价</a-radio>
          <a-radio value="1" class="customize-box">
            <div class="customize">
              自定义
              <a-radio-group
                v-model="priceUnit"
                v-if="form.price === '1'"
                style="width: 100%"
                class="customize-radio-group"
              >
                <a-radio value="1" :style="radioStyle">
                  <div class="costPrice">
                    基于建议零售价上调：
                    <div class="input-box">
                      <a-input
                        v-if="form.price === '1' && priceUnit === '1'"
                        v-model="form.raiseValue"
                        placeholder="请输入"
                        class="input"
                      />
                      <a-input v-else disabled placeholder="请输入" class="input" />元
                    </div>
                    <a-popover placement="right">
                      <template slot="content">
                        <!-- <span v-if="unit === '%'">例：成本价为100元，上调10%，则售价为110元</span> -->
                        <span>例：成本价为100元，上调30元，则售价为130元</span>
                      </template>
                      <a-icon class="tips" type="info-circle" />
                    </a-popover>
                  </div>
                </a-radio>
                <a-radio value="2" :style="radioStyle">
                  <div class="costPrice">
                    基于建议零售价上调：
                    <div class="input-box">
                      <a-input
                        v-if="form.price === '1' && priceUnit === '2'"
                        v-model="form.raiseValue"
                        placeholder="请输入"
                        class="input"
                      /><a-input v-else disabled placeholder="请输入" class="input" />%
                    </div>
                    <a-popover placement="right">
                      <template slot="content">
                        <span>例：成本价为100元，上调10%，则售价为110元</span>
                      </template>
                      <a-icon class="tips" type="info-circle" />
                    </a-popover>
                  </div>
                </a-radio>
              </a-radio-group>
            </div>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item ref="commission" label="设置分销佣金" prop="commission">
        <a-radio-group v-model="form.commission">
          <a-radio value="1" :style="radioStyle">
            <div class="costPrice">
              固定佣金，佣金为：
              <div class="input-box">
                <a-input
                  v-if="form.commission === '1'"
                  v-model="form.commissionValue"
                  placeholder="请输入"
                  class="input"
                /><a-input v-else disabled placeholder="请输入" class="input" />元
              </div>
            </div>
          </a-radio>
          <a-radio value="2" :style="radioStyle">
            <div class="costPrice">
              按比例分佣，佣金为零售价的：
              <div class="input-box">
                <a-input
                  v-if="form.commission === '2'"
                  v-model="form.commissionValue"
                  placeholder="请输入"
                  class="input"
                /><a-input v-else disabled placeholder="请输入" class="input" />%
              </div>
            </div>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submit"> 批量导出商品 </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import categoryApi from '@/api/category'

  import { download } from '@/utils/util'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import axios from 'axios'

  export default {
    data() {
      return {
        channel: '',
        labelCol: { span: 5 },
        wrapperCol: { span: 13 },
        categories: [],
        brandName: '',
        radioStyle: {
          display: 'block',
          height: '50px',
          lineHeight: '50px',
          position: 'relative'
        },
        radioStyleBorder: {
          width: '100%',
          display: 'block',
          height: '50px',
          lineHeight: '50px',
          'border-bottom': '1px solid rgba(209, 207, 207, 0.4)'
        },
        unit: '元',
        priceUnit: '1',
        form: {
          cate: undefined,
          price: '0',
          commission: '1',
          raiseValue: '',
          commissionValue: ''
        },
        rules: {
          cate: [{ required: true, message: '请选择分类', trigger: 'change' }],
          price: [{ required: true, message: '请选择售价类型', trigger: 'change' }],
          commission: [{ required: true, message: '请选择佣金类型', trigger: 'change' }]
        }
      }
    },
    computed: {
      ...mapGetters(['category', 'brandList'])
    },
    created() {
      this.getList()
      this.channel = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? 'yunpi' : (process.env.VUE_APP_PROJECT_TYPE === 'HOMAHO' ? 'homaho' : 'gewu')
    },
    mounted() {
      console.log(this.category, 'category')
      if (this.brandList.length === 0) {
        this.$message.error('分类未选择，请重新选择')
        this.$router.push({ name: 'OmsClassify' })
        return false
      }
      let nameList = []
      this.brandList.forEach((v) => {
        nameList.push(v.name)
      })
      if (nameList.length > 0) {
        this.brandName = nameList.join('/')
      }
    },
    methods: {
      ...mapActions(['setBrand', 'setCategory']),
      async getList() {
        const {
          data: { categories }
        } = await categoryApi.list()
        this.categories = categories
      },
      checkRate(nubmer) {
        let isNumber = true
        let re = /^[0-9]+.?[0-9]*/ // 判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
        if (!re.test(nubmer)) {
          isNumber = false
        }
        return isNumber
      },
      submit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (+this.form.price === 1 && this.form.raiseValue === '') {
              this.$message.warning('请输入上调成本价！')
              return false
            }
            if (+this.form.price === 1 && Number(this.form.raiseValue) < 0) {
              this.$message.warning('成本价不能为负数！请重新输入')
              return false
            }
            if (+this.form.price === 1 && !this.checkRate(this.form.raiseValue)) {
              this.$message.warning('成本价必须为数字！请重新输入')
              return false
            }
            if (this.form.commissionValue === '') {
              this.$message.warning('请输入分销佣金！')
              return false
            }
            if (Number(this.form.commissionValue) < 0) {
              this.$message.warning('佣金不能为负数！请重新输入')
              return false
            }
            if (!this.checkRate(this.form.commissionValue)) {
              this.$message.warning('佣金必须为数字！请重新输入')
              return false
            }
            let brandIds = []
            this.brandList.forEach((v) => {
              brandIds.push(v.brandId)
            })
            let priceType = 0
            if (+this.form.price !== 0) {
              priceType = this.priceUnit
            }
            let submintForm = {
              commissionType: this.form.commission,
              priceType,
              thirdPartyCategory: this.category.categoryId,
              raiseValue: this.form.raiseValue || 0,
              commissionValue: this.form.commissionValue,
              storeCategory: this.form.cate,
              brandIds: brandIds.join(','),
              channel: this.channel
            }
            download(Vue, ACCESS_TOKEN, axios, '/v1/supply', '批量导出商品.xlsx', submintForm, true)
            // this.sendGoods(submintForm)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleChange(val) {
        console.log(val)
        if (+val === 1) {
          this.unit = '元'
        } else {
          this.unit = '%'
        }
      }
    }
  }
</script>
<style lang="less">
  .customize-box {
    display: flex;
    align-items: flex-start;
    > .ant-radio {
      margin-top: 24px;
    }
  }
</style>
<style lang="less" scoped>
  .hd {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #001629;
      line-height: 22px;
    }
  }
  .input-box {
    display: flex;
    align-items: center;
    width: 100%;
    .con {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
  }
  .customize {
    // display: inline-block;
    display: flex;
    align-items: flex-start;
    margin-top: 22px;
    .customize-radio-group {
      margin-top: -14px;
      margin-left: 79px;
    }
  }
  .costPrice {
    position: absolute;
    top: 0;
    left: 22px;
    display: flex;
    align-items: center;
    .input-box {
      margin-right: 10px;
      width: 120px;
      height: 30px;
      padding: 0 10px;
      // box-sizing: border-box;
      background: rgba(1, 32, 64, 0.08);
      border-radius: 4px;
      display: flex;
      align-items: center;
      .input {
        border: none;
        background: none;
      }
    }
  }
</style>
