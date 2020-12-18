<template>
  <!-- 创建优惠券
post api/merchant_manage/v1/coupons
param! :channel_type, Integer, required: true, message: "推广渠道类型"
param! :channel_name, String, required: false, message: "推广渠道名称"
param! :title, String, required: true, default: "", message: "券标题"
param! :event_start_time, Date, required: false, message: "领券开始时间"
param! :event_end_time, Date, required: false, message: "领券结束时间"
param! :publish_count, Integer, required: true, default: 0, message: "发行数量"
param! :per_limit, Integer, required: false, default: 0, message: "限领数量"
param! :with_amount, BigDecimal, precision: 5, required: false, default: 0, message: "满减，起减值"
param! :used_amount, BigDecimal, precision: 5, required: false, default: 0, message: "用券金额, 折扣券代表折扣"
param! :validity_type, Integer, required: true, default: 0, message: "领取有效时间类型：0时间段，1领取起有效天数"
param! :start_time, Date, required: false, message: "券有效开始时间"
param! :end_time, Date, required: false, message: "券有效结束时间"
param! :effective, Integer, required: false, default: 0, message: "领取起有效天数"
param! :goods_nos, String, required: false, default: "", message: "商品编号"
param! :coupon_type, Integer, required: false, default: 0, message: "优惠券类型：1商品满减券，2商品折扣券，3商品直减券，4店铺满减券，5店铺折扣券，6店铺直减券" -->
  <div>
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-card>
        <h2>推广方式</h2>
        <div class="radio-style">
          <a-radio-group v-model="form.channel_type" class="a-radio-group">
            <a-radio :style="radioStyle" :value="0">
              <div class="Type">
                <div class="LT">店内推广</div>
                <div class="RT">将会按照券的类型，自动出现在小商店的首页、商品详情页等展示位，吸引用户领券下单</div>
              </div>
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              <div class="Type">
                <div class="LT">自定义推广渠道</div>
                <div class="RT">
                  创建后的券将不会出现在小商店内，但支持商家自行下载携带券二维码的海报，传播至自有渠道，如朋友圈、微信会话等。每张券二维码均各自独立，方便商家核销各渠道效果
                </div>
              </div>
            </a-radio>
          </a-radio-group>
          <div class="input" v-if="form.channel_type === 1">
            <a-input v-model="form.channel_name" placeholder="请输入渠道名（选填）" />
          </div>
        </div>
      </a-card>
      <div style="width:100%;height:20px"></div>
      <a-card>
        <h2>券基本信息</h2>
        <a-form-model-item ref="title" label="券名称" prop="title">
          <a-input v-model="form.title" placeholder="请输入优惠券名称" />
        </a-form-model-item>
        <a-form-model-item ref="date" label="领取时间" prop="date">
          <a-range-picker v-model="date" format="YYYY-MM-DD" @change="onDateChange" />
        </a-form-model-item>
        <a-form-model-item ref="publish_count" label="发放张数" prop="publish_count">
          <a-input v-model="form.publish_count" placeholder="请输入数量" suffix="张" />
        </a-form-model-item>
        <a-form-model-item ref="per_limit" label="每人限领" prop="per_limit">
          <a-input v-model="form.per_limit" placeholder="请输入限领张数" suffix="张" />
        </a-form-model-item>
        <a-form-model-item ref="coupon_type" label="券类型" prop="coupon_type">
          <a-select v-model="form.coupon_type" placeholder="请选择优惠券类型">
            <a-select-option :value="val.value" v-for="(val, idx) in couponList" :key="idx">{{
              val.name
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 1商品满减券，2商品折扣券，3商品直减券，4店铺满减券，5店铺折扣券，6店铺直减券 -->
        <a-form-model-item
          ref="with_amount"
          label="起减值"
          prop="with_amount"
          v-if="form.coupon_type === 1 || form.coupon_type === 4"
        >
          <a-input v-model="form.with_amount" placeholder="请输入起减值" suffix="元" />
        </a-form-model-item>
        <a-form-model-item
          ref="used_amount"
          :label="form.coupon_type === 2 || form.coupon_type === 5 ? '用券折扣' : '用券金额'"
          prop="used_amount"
        >
          <a-input
            v-model="form.used_amount"
            :placeholder="form.coupon_type === 2 || form.coupon_type === 5 ? '请输入用券折扣' : '请输入用券金额'"
            :suffix="form.coupon_type === 2 || form.coupon_type === 5 ? '%' : '元'"
          />
        </a-form-model-item>
        <a-form-model-item ref="validity_type" label="券有效期" prop="validity_type">
          <a-select v-model="form.validity_type" placeholder="请选择有效期类型">
            <a-select-option :value="val.value" v-for="(val, idx) in timeTypeList" :key="idx">{{
              val.name
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="form.validity_type === 0" ref="couponDate" label="有效时间段" prop="couponDate">
          <a-range-picker v-model="couponDate" format="YYYY-MM-DD" @change="onCouponDateChange" />
        </a-form-model-item>
        <a-form-model-item v-else ref="effective" label="有效天数" prop="effective">
          <a-input v-model="form.effective" placeholder="请输入有效天数" />
        </a-form-model-item>
        <a-form-model-item label="领取跳转至" v-if="form.coupon_type===1||form.coupon_type===2||form.coupon_type===3">
          <a-select v-model="form.goods_nos" placeholder="请选择商品" @popupScroll="handlePopupScroll">
            <a-select-option :value="val.goodsNo" v-for="(val, idx) in goodsList" :key="idx">{{
              val.name
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-row>
          <a-col class="submit-btn">
            <a-button type="primary" @click="submit">提交</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment'
import couponApi from '@/api/coupon'
import goodsApi from '@/api/goods'

export default {
  data() {
    return {
      page: 1,
      form: {
        channel_type: 0,
        channel_name: '',
        title: '',
        effective: 0,
        event_start_time: '',
        event_end_time: '',
        publish_count: '',
        coupon_type: 1,
        per_limit: '',
        with_amount: '',
        used_amount: '',
        validity_type: 0,
        start_time: '',
        end_time: '',
        goods_nos: undefined
      },
      couponList: [
        { value: 1, name: '商品满减券' },
        { value: 2, name: '商品折扣券' },
        { value: 3, name: '商品直减券' },
        { value: 4, name: '店铺满减券' },
        { value: 5, name: '店铺折扣券' },
        { value: 6, name: '店铺直减券' }
      ],
      timeTypeList: [
        { value: 0, name: '时间段' },
        { value: 1, name: '领取起有效天数' }
      ],
      date: [],
      couponDate: [],
      goodsList: [],
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
      radioStyle: {
        display: 'block',
        height: '50px',
        width: '100%',
        position: 'relative'
      },
      warnByUsedAmount: '请输入券折扣',
      rules: {
        title: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        publish_count: [{ required: true, message: '请输入发行数量', trigger: 'blur' }],
        with_amount: [{ required: true, message: '请输入起减值', trigger: 'blur' }],
        used_amount: [{ required: true, message: '请输入用券金额', trigger: 'blur' }],
        per_limit: [{ required: true, message: '请输入限领张数', trigger: 'blur' }],
        effective: [{ required: true, message: '请输入有效天数', trigger: 'blur' }],
        date: [
          {
            required: true,
            validator: (rule, value, cb) => {
              let message = ''
              if (this.date.length === 0) {
                message = '请选择领取时间'
                cb(message)
                return
              }
              cb()
            },
            trigger: 'blur'
          }
        ],
        couponDate: [
          {
            required: true,
            validator: (rule, value, cb) => {
              let message = ''
              if (this.couponDate.length === 0) {
                message = '请选择有效时间段'
                cb(message)
                return
              }
              cb()
            },
            trigger: 'change'
          }
        ],
        coupon_type: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
        validity_type: [{ required: true, message: '请选择有效期类型', trigger: 'change' }]
      }
    }
  },
  watch: {
    form: {
      handler() {
        this.rules.used_amount[0].message =
          this.form.coupon_type === 2 || this.form.coupon_type === 5 ? '请输入券折扣' : '请输入券金额'
      },
      deep: true
    }
  },
  mounted () {
    this.fetchGoodsions(this.page)
  },
  methods: {
    nextPage() {
      let page = this.page + 1
      this.fetchGoodsions(page)
    },
    async fetchGoodsions(page) {
      const { data } = await goodsApi.list({ page })
      if (data.list.length > 0) {
        this.page = page
        if (page === 1) {
          this.goodsList = data.list
        } else {
          this.goodsList = [...this.goodsList, ...data.list]
        }
      }
    },
    handlePopupScroll(e) {
      const { target } = e
      const rmHeight = target.scrollHeight - target.scrollTop
      const clHeight = target.clientHeight
      if (rmHeight === clHeight) this.nextPage()
    },
    onDateChange(e) {
      if (e.length > 0) {
        this.form.event_start_time = moment(this.date[0]).format('YYYY-MM-DD')
        this.form.event_end_time = moment(this.date[1]).format('YYYY-MM-DD')
      } else {
        this.form.event_start_time = ''
        this.form.event_end_time = ''
      }
    },
    onCouponDateChange(e) {
      if (e.length > 0) {
        this.form.start_time = moment(this.couponDate[0]).format('YYYY-MM-DD')
        this.form.end_time = moment(this.couponDate[1]).format('YYYY-MM-DD')
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
    },
    async submit() {
      await this.$refs.form.validate()
      let form = this.form
      if (this.form.coupon_type !== 1 && this.form.coupon_type !== 4) form.with_amount = 0
      if (+form.validity_type === 0) {
        form.effective = 0
      } else {
        delete form.start_time
        delete form.end_time
      }
      let { meta } = await couponApi.create(form)
      if (meta.code === 0) {
        this.$message.success('操作成功')
        this.$router.push({
          path: '/coupon/index'
        })
      }
    }
  }
}
</script>
<style lang="less">
label {
  word-break: break-word;
}
.ant-radio-wrapper {
  word-wrap: break-word !important;
  white-space: normal;
}
.radio-style {
  margin-left: 60px;
  .a-radio-group {
    width: 100%;
  }
}
.Type {
  position: absolute;
  top: -5px;
  left: 30px;
  display: flex;
  align-items: center;
  right: 0;
  .LT {
    font-size: 20px;
    margin-right: 10px;
  }
  .RT {
    flex: 1;
    word-wrap: break-word !important;
  }
  .input {
    margin-top: 20px;
    border: 1px solid #000;
    border-radius: 20px;
    height: 50px;
  }
}
.submit-btn {
  text-align: center;
}
</style>
