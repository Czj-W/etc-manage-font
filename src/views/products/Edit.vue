<template>
  <div>
    <a-spin :spinning="subLoading">
      <a-form-model ref="form" :model="form" :rules="rules" v-bind="layout">
        <a-card class="card">
          <h2>1. 商品基本信息</h2>
          <a-form-model-item label="商品名称" prop="name">
            <a-input v-model="form.name" :disabled="form.isOmsGoods" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item label="商品品牌">
            <a-input v-model="form.brandName" :disabled="form.isOmsGoods" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item label="上传轮播图" prop="images">
            <div class="banner-area">
              <div
                class="banner"
                @click="() => $refs.listPic.click()"
                v-if="form.imagesUrl.length < 9 && !form.isOmsGoods"
              >
                <div>
                  <form ref="bannerForm">
                    <a-icon class="upload-icon" type="plus" />
                    <input
                      type="file"
                      ref="listPic"
                      accept="images/*"
                      style="display: none"
                      @change="uploadBannerImage"
                    />
                    <div>上传</div>
                  </form>
                </div>
              </div>
              <draggable v-model="form.imagesUrl" class="banners">
                <transition-group>
                  <div class="banner" v-for="(image, index) in form.imagesUrl" :key="'name'+index">
                    <img :src="image" />
                    <div class="banner-delete" @click="removeBannerImages(index)">
                      <a-icon v-if="!form.isOmsGoods" type="close-circle" />
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </a-form-model-item>
        </a-card>
        <a-card class="card">
          <h2>2. 商品规格与售价信息</h2>
          <a-row>
            <a-col :span="3" class="ant-form-item-label">
              <label title="商品规格">商品规格</label>
            </a-col>
            <a-col :span="18">
              <a-radio-group
                :disabled="form.isOmsGoods"
                name="radioGroup"
                :default-value="goodsModel"
                v-model="goodsModel"
                class="radioGroup-style"
                @change="onModeChange"
              >
                <a-radio :value="0">极简模式</a-radio>
                <a-radio :value="1">单规格模式</a-radio>
                <a-radio :value="2">多规格模式</a-radio>
              </a-radio-group>
              <div v-for="(size, index) in form.sizes" :key="index" :class="goodsModel !== 0 ? 'box' : ''">
                <a
                  class="close-icon"
                  v-if="!form.isOmsGoods && form.sizes.length > 2 && goodsModel !== 0"
                  @click="deleteSize(index)"
                ></a>
                <div v-if="goodsModel !== 0">
                  <a-form-model-item class="w-100">
                    <a-row class="flex">
                      <a-col>
                        <!-- <a
                        class="size-action"
                        :disabled="form.isOmsGoods"
                        @click="deleteSize(index)"
                      >删除规格</a>-->
                        规格名称：
                      </a-col>
                      <a-col span="12">
                        <a-input
                          :disabled="form.isOmsGoods"
                          v-model="size.name"
                          placeholder="请输入规格名称，如颜色，码数"
                        />
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                  <a-form-model-item class="w-100" v-for="(child, indexx) in size.children" :key="`${index}-s${indexx}`">
                    <a-row class="flex">
                      <a-col class="options-ml20">选项{{ indexx + 1 }}名称：</a-col>
                      <a-col span="12">
                        <a-input
                          :disabled="form.isOmsGoods"
                          v-model="child.name"
                          placeholder="请输入选项名称，如白色，42码"
                        />
                      </a-col>
                      <a-col :span="7">
                        <a
                          class="size-action"
                          :disabled="form.isOmsGoods || indexx === 0"
                          @click="deleteSizeChildren(index, indexx)"
                        >删除选项名称</a
                        >
                        <a
                          v-if="indexx == size.children.length - 1"
                          :disabled="form.isOmsGoods"
                          class="size-action"
                          @click="addSizeChildren(index)"
                        >添加选项名称</a
                        >
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </div>
              </div>
              <a-button
                v-if="goodsModel === 2"
                type="primary"
                :disabled="form.isOmsGoods"
                @click="addSize(-1)"
              >添加规格</a-button
              >
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="3" class="ant-form-item-label">
              <label title="分佣类型">分佣类型</label>
            </a-col>
            <a-col :span="18">
              <a-radio-group
                name="commissionType"
                v-model="commissionType"
                class="radioGroup-style"
                @change="onCommissionChange"
              >
                <a-radio :value="2">按比例分佣（%）</a-radio>
                <a-radio :value="1">按固定分佣（元）</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
          <a-form-model-item label="价格及库存" class="skus" prop="skus">
            <a-row v-if="form.sizes.length > 0" class="batch-setting">
              <a-col>
                <div>
                  <div class="span-style">批量设置</div>
                  <span>在下方栏中选择内容进行填充，点击立即设置按钮后，可重新批量设置下一目标</span>
                </div>
                <div class="div-flex">
                  <a-col class="div-flex-child" v-for="(size, index) in form.sizes" :key="index">
                    <a-select default-value="全部" v-model="sizeSetting[index]">
                      <a-select-option
                        v-for="(child, indexx) in [{ name: '全部' }].concat(size.children)"
                        :key="`${index}-${indexx}`"
                        :value="child.name"
                      >{{ child.name }}</a-select-option
                      >
                    </a-select>
                  </a-col>
                  <a-col class="div-flex-child" v-for="(setting, index) in batchSetting" :key="index">
                    <a-input-number
                      class="inputNumStyle"
                      v-model="batchSetting[index]"
                      :placeholder="settingPlaceholder[index]"
                      :min="0"
                    ></a-input-number>
                  </a-col>
                  <a-col :span="3">
                    <a-button type="primary" @click="setRows">立即设置</a-button>
                  </a-col>
                </div>
              </a-col>
            </a-row>
            <a-table
              :scroll="{ x: form.isOmsGoods ? 1200 : 'auto' }"
              :columns="
                form.isOmsGoods
                  ? columns
                  : columns.filter(
                    item => item.title !== '建议零售价' && item.title !== '成本价' && item.title !== '利润'
                  )
              "
              rowKey="skuNo"
              :pagination="false"
              :data-source="form.skus"
              bordered
            ></a-table>
          </a-form-model-item>
        </a-card>
        <a-card class="card">
          <h2>3. 更多设置</h2>
          <a-form-model-item label="商品分类" prop="size">
            <div>
              <a @click="categoryModalVisible = true">添加</a>
            </div>
            <a-checkbox-group v-model="form.categoryIds">
              <a-row type="flex">
                <a-col v-for="xcategory in categories" :key="xcategory.id">
                  <a-checkbox :value="xcategory.id">{{ xcategory.name }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item label="商品详情" prop="desc">
            <a-textarea v-model="form.desc" :disabled="form.isOmsGoods" placeholder="请输入商品详情（选填）" />
          </a-form-model-item>
          <a-form-model-item label="上传商品详情图片" prop="detailImages">
            <div class="banner-area">
              <div
                class="banner"
                @click="() => $refs.detailPic.click()"
                v-if="form.detailImagesUrl.length < 9 && !form.isOmsGoods"
              >
                <div>
                  <form ref="detailImageForm">
                    <a-icon class="upload-icon" type="plus" />
                    <input
                      type="file"
                      ref="detailPic"
                      accept="images/*"
                      style="display: none"
                      @change="uploadDetailImage"
                    />
                    <div>上传</div>
                  </form>
                </div>
              </div>
              <draggable v-model="form.detailImagesUrl" class="banners">
                <transition-group>
                  <div class="banner" v-for="(image, index) in form.detailImagesUrl" :key="'image'+index">
                    <img :src="image" />
                    <div class="banner-delete" @click="removeDetailImages(index)">
                      <a-icon v-if="!form.isOmsGoods" type="close-circle" />
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </a-form-model-item>
        </a-card>
        <a-card class="card">
          <h2>4. 服务与承诺</h2>
          <a-form-model-item :required="true" label="支付方式" prop="payWay">
            <a-checkbox :checked="true" :disabled="form.isOmsGoods">线上支付（默认）</a-checkbox>
          </a-form-model-item>
          <a-form-model-item :required="true" label="快递物流" prop="expressWay">
            <a-radio-group v-model="form.expressWay" :disabled="form.isOmsGoods">
              <a-radio :value="1">卖家包邮（默认）</a-radio>
              <a-radio :value="3">物流到付</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="发货时间承诺" prop="time">
            <a-radio-group
              name="radioGroup"
              :default-value="form.promiseExpressTime"
              v-model="form.promiseExpressTime"
              @change="onTimeChange"
              :disabled="form.isOmsGoods"
            >
              <a-radio :value="0">当天发货</a-radio>
              <a-radio :value="1">24小时</a-radio>
              <a-radio :value="2">48小时</a-radio>
              <a-radio :value="3">
                其他
                <a-input
                  v-model="form.promiseExpressTimeVal"
                  :disabled="form.isOmsGoods"
                  autocomplete="off"
                  placeholder="请输入发货时间"
                />
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="退货" prop="description">
            <a-radio-group
              name="radioGroup"
              :disabled="form.isOmsGoods"
              :default-value="form.promiseRefundType"
              v-model="form.promiseRefundType"
              @change="onDescriptionChange"
            >
              <a-radio :value="0">7天无理由退换</a-radio>
              <a-radio :value="1">
                不可退换
                <a-input
                  :disabled="form.isOmsGoods"
                  v-model="form.promiseRefundReason"
                  autocomplete="off"
                  placeholder="请输入理由"
                />
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-row>
            <a-col class="submit-btn">
              <a-button type="primary" @click="submit">提交并上架</a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
      <a-modal
        :visible="categoryModalVisible"
        title="添加分类"
        ok-text="确认"
        cancel-text="取消"
        @ok="appendCategory"
        @cancel="categoryModalVisible = false"
      >
        <a-form-model ref="category" :model="category" :rules="rules" v-bind="categoryFormLayout">
          <a-form-model-item label="添加分类" prop="name">
            <a-input v-model="category.name"></a-input>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </div>
</template>

<script>
import Vue from 'vue'
import categoryApi from '@/api/category'
import draggable from 'vuedraggable'
import goodsApi from '@/api/goods'
import { MESH_NO } from '@/store/mutation-types'
import upyun from '@/utils/upyun'
import { isNumber } from '@/utils/util'
import { Decimal } from 'decimal.js'

export default {
  components: {
    draggable
  },
  data() {
    return {
      modalVisible: false,
      isHomaHo: false,
      subLoading: false,
      shareName: '分销',
      promoteName: '推广',
      category: {
        name: ''
      },
      goodsModel: 0, // 0极简模式, 1单规格, 2多规格
      commissionType: 2, // 1固定佣金、2比例佣金
      form: {
        name: '',
        brandName: '',
        isOmsGoods: false,
        expressWay: 1,
        payWay: 0,
        meshNo: Vue.ls.get(MESH_NO),
        images: [],
        imagesUrl: [],
        detailImages: [],
        detailImagesUrl: [],
        skus: [],
        sizes: [],
        promiseExpressTime: 0,
        promiseExpressTimeVal: '',
        promiseRefundType: 0,
        promiseRefundReason: ''
      },
      rules: {
        name: [{ required: true, message: '请填写', trigger: 'blur' }],
        skus: [{ required: true, message: '请填写', trigger: 'blur' }],
        images: [{ required: true, message: '请上传轮播图片', trigger: 'blur' }]
      },
      categories: [],
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
      },
      sizeSetting: {
        0: '全部',
        1: '全部'
      },
      batchSetting: {
        number: '',
        retailPrice: '',
        linePrice: '',
        price: '',
        marketPrice: '',
        shareCommission: '',
        promoteCommission: ''
      },
      settingPlaceholder: {
        number: '库存',
        retailPrice: '建议零售价',
        linePrice: '划线价（元）',
        price: '售价（元）',
        marketPrice: '成本价',
        shareCommission: process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '销售佣金' : '分销佣金',
        promoteCommission: process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '分销佣金' : '推广佣金',
        profit: '利润'
      },
      tag: '',

      goodsRaw: null,
      tags: ['Apple', 'Orange'],
      tagOptions: ['Apple', 'Pear', 'Orange'],
      categoryModalVisible: false,
      categoryFormLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 }
      },
      initedSku: false
    }
  },
  computed: {
    columns() {
      let columns = [
        {
          title: '库存',
          id: 0,
          customRender: (text, row, index) => {
            return {
              children: <a-input-number disabled={row.isOMS} step="1" v-model={row.number} min={0}></a-input-number>
            }
          }
        },
        {
          title: '成本价',
         id: 1,
          customRender: (text, row, index) => {
            return {
              children: <a-input-number disabled={row.isOMS} v-model={row.marketPrice} min={0}></a-input-number>
            }
          }
        },
        {
          title: '建议零售价',
         id: 2,
          customRender: (text, row, index) => {
            return {
              children: (
                <a-input-number disabled={row.isOMS} step="1" v-model={row.retailPrice} min={0}></a-input-number>
              )
            }
          }
        },
        {
          title: <div>划线价（元）</div>,
         id: 3,
          customRender: (text, row, index) => {
            return {
              children: <a-input-number v-model={row.linePrice} min={0}></a-input-number>
            }
          }
        },
        {
         id: 4,
          title: (
            <div>
              售价（元）
              <a-popover placement="right">
                <template slot="content">
                  <span>实收结算价=(售价-手续费-支付手续费-佣金)</span>
                </template>
                <a-icon class="tips" type="info-circle" />
              </a-popover>
            </div>
          ),

          customRender: (text, row, index) => {
            return {
              children: (
                <div>
                  <a-input-number v-model={row.price} min={0}></a-input-number>
                  <div>实收：{row.paid_price}</div>
                </div>
              )
            }
          }
        },

        {
         id: 5,
          title: (
            <div>
              {this.shareName}佣金（{this.commissionType === 1 ? '元' : '%'}）
              <a-popover placement="right">
                <template slot="content">
                  <span>实收佣金 = (佣金 * (1-10%) [10%为税务费用])</span>
                </template>
                <a-icon class="tips" type="info-circle" />
              </a-popover>
            </div>
          ),
          customRender: (text, row, index) => {
            return {
              children: (
                <div>
                  <a-input-number v-model={row.shareCommission} min={0}></a-input-number>
                  <div>实收：{row.paid_s_commission}</div>
                </div>
              )
            }
          }
        },
        {
         id: 6,
          title: (
            <div>
              {this.promoteName}佣金（{this.commissionType === 1 ? '元' : '%'}）
            </div>
          ),
          customRender: (text, row, index) => {
            return {
              children: (
                <div>
                  <a-input-number v-model={row.promoteCommission} min={0}></a-input-number>
                  <div>实收：{row.paid_p_commission}</div>
                </div>
              )
            }
          }
        },
        {
         id: 7,
          title: <div>规格图</div>,
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="skusImage" onclick={() => this.handleClickSkus(row, index)}>
                  <a-spin spinning={row.isLoading || false}>
                    {row.image === '' ? (
                      <a-icon class="upload-icon" type="plus" />
                    ) : (
                      <img src={row.imageUrl} class="img-skus" />
                    )}
                    {row.image === '' ? '' : <div class="del" onclick={() => this.delSkusImage(index)}></div>}
                    <input
                      class="input-skus"
                      type="file"
                      ref={`detailPic${index}`}
                      accept="images/*"
                      style="display: none;"
                      onchange={e => this.uploadSkusImage(e, index)}
                    />
                  </a-spin>
                </div>
              )
            }
          }
        },
        {
         id: 8,
          title: '利润',
          width: 100,
          fixed: 'right',
          customRender: (text, row, index) => {
            return {
              children: row.warn_style ? (
                <div style="color:red;font-size:25px">{row.profit}</div>
              ) : (
                <div style="color:#F2BC4A;font-size:25px">{row.profit}</div>
              )
            }
          }
        }
      ]
      if (this.isHomaHo) columns = columns.filter(item => item.id !== 6)
      const sizeColumns = []
      const sizes = this.form.sizes.filter(it => it.name.length > 0)
      if (sizes.length === 0) {
        return columns
      }

      for (const index in sizes) {
        const name = sizes[index].name
        if (index < 1) {
          sizeColumns.push({
            title: <div>{name}</div>,
            customRender: (text, row, index) => {
              let rowSpan = 1
              if (sizes.length === 2) {
                if (index % sizes[1].children.length === 0) {
                  rowSpan = sizes[1].children.length
                } else {
                  rowSpan = 0
                }
              }
              return {
                children: <span>{row.p1}</span>,
                attrs: {
                  rowSpan: rowSpan
                }
              }
            }
          })
        } else {
          sizeColumns.push({
            title: <div>{name}</div>,
            customRender: (text, row, indexs) => {
              return {
                children: <span>{row.specifications[index].value}</span>
              }
            }
          })
        }
      }

      return sizeColumns.concat(columns)
    }
  },
  watch: {
    form: {
      handler() {
        if (this.form.skus.length > 0) {
          this.form.skus.forEach((v, i) => {
            v.isOMS = this.form.isOmsGoods || false
            const price = Number(v.price || 0)
            const marketPrice = Number(v.marketPrice || 0)
            let promoteCommission = Number(v.promoteCommission || 0)
            let shareCommission = Number(v.shareCommission || 0)
            if (v.commissionType === 2) {
              let pc = Number(v.promoteCommission / 100)
              let sc = Number(v.shareCommission / 100)
              promoteCommission = new Decimal(price).mul(pc)
              promoteCommission = this.toCeil(promoteCommission)
              shareCommission = new Decimal(price).mul(sc)
              shareCommission = this.toCeil(shareCommission)
            }
            // 计算公式https://shimo.im/sheets/wwtdPt3WwjWDyJCt/MODOC/
            let val1 = new Decimal(price).sub(this.toCeil(new Decimal(price).mul(0.01))).sub(this.toCeil(new Decimal(price).mul(0.006)))
            let val2 = new Decimal(promoteCommission).add(shareCommission)
            let val3 = new Decimal(val1).sub(val2).sub(marketPrice)
            const paidPrice = this.toFloor(val3)
            let val4 = new Decimal(promoteCommission).sub((this.toCeil(new Decimal(promoteCommission).mul(0.1))))
            const paidPCommission = this.toFloor(val4)
            let val5 = new Decimal(shareCommission).sub((this.toCeil(new Decimal(shareCommission).mul(0.1))))
            const paidSCommission = this.toFloor(val5)

            Vue.set(this.form.skus[i], 'paid_price', paidPrice)
            Vue.set(this.form.skus[i], 'paid_p_commission', paidPCommission)
            Vue.set(this.form.skus[i], 'paid_s_commission', paidSCommission)
            Vue.set(this.form.skus[i], 'profit', paidPrice)
            if (paidPrice < 0) {
              Vue.set(this.form.skus[i], 'warn_style', true)
            } else {
              Vue.set(this.form.skus[i], 'warn_style', false)
            }
          })
        }
      },
      deep: true
    },
    'form.sizes': {
      handler() {
        this.form.sizes.forEach((v, i) => {
          Vue.set(this.sizeSetting, i, '全部')
        })
        this.updateRows()
      },
      deep: true
    }
  },
  mounted() {
    this.fetchCategories()
    if (this.$route.params.id) {
      this.fetchGoods(this.$route.params.id)
    } else {
      this.form.sizes.push({ name: '', children: [{ name: '' }] })
      delete this.batchSetting.retailPrice
      delete this.batchSetting.marketPrice
    }
  },
  created() {
    this.shareName = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '销售' : '分销'
    this.promoteName = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '分销' : '推广'
    this.isHomaHo = process.env.VUE_APP_PROJECT_TYPE === 'HOMAHO'
    if (this.isHomaHo) {
      delete this.batchSetting.promoteCommission
      delete this.settingPlaceholder.promoteCommission
    }
  },
  methods: {
    async fetchGoods(id) {
      const { data } = await goodsApi.show(id)
      const sp = JSON.stringify(data.specifications)
      let specifications = data.specifications
      this.goodsModel = data.goodsModel
      if (sp === '{}') {
        this.goodsModel = 0
        specifications = { '': [{ specification: '', value: '', sortScore: 0 }] }
      }
      console.log(Object.keys(specifications), 123)
      const sizes = Object.keys(specifications).map(it => ({
        name: it,
        children: specifications[it].map(size => ({ name: size.value }))
      }))
      if (sizes[0].name === '') {
        this.goodsModel = 0
      }

      this.goodsRaw = data
      this.form = {
        ...data,
        sizes,
        images: data.imagesData.images.map(it => it.image),
        imagesUrl: data.images,
        detailImages: data.imagesData.detailImages.map(it => it.image),
        detailImagesUrl: data.detailImgs,
        brandName: data.brandName || '',
        categoryIds: data.productCategories.map(it => it.id),
        skus: data.skus.map((it, index) => {
          const sizes = it.skuNo.split('_').slice(1)
          const row = {}
          for (const i in sizes) {
            row[`p${i + 1}`] = sizes[i]
          }
          return { ...it, id: index, ...row }
        })
      }
      this.form.imagesUrl = JSON.parse(JSON.stringify(this.form.imagesUrl))
      console.log(this.form, 'form')
      if (data.isOmsGoods) {
        delete this.batchSetting.number
        delete this.batchSetting.retailPrice
        delete this.batchSetting.marketPrice
        delete this.batchSetting.profit
      } else {
        delete this.batchSetting.retailPrice
        delete this.batchSetting.marketPrice
      }
      this.updateRows()
      this.initedSku = true
    },
    addSizeChildren(index) {
      // let i = 0
      // for (const size of this.form.sizes) {
      //   i += size.children.length
      // }
      // if (i >= 10) {
      //   this.$message.warn('最多添加 10 个规格名称')
      //   return
      // }
      this.form.sizes[index].children.push({ name: '' })
    },
    addSize(num) {
      if (num === 1) {
        this.form.sizes = []
        this.form.sizes = [{ name: '', children: [{ name: '' }] }]
      } else if (num === -1) {
        this.form.sizes.push({ name: '', children: [{ name: '' }] })
      } else {
        this.form.sizes = []
        this.form.sizes = [
          { name: '', children: [{ name: '' }] },
          { name: '', children: [{ name: '' }] }
        ]
      }
    },
    handleClickSkus(val, i) {
      if (this.form.skus[i].isLoading) return
      this.$refs[`detailPic${i}`].click()
    },
    toFloor(num) {
      let val = new Decimal(num).mul(100)
      return Math.floor(val) / 100
    },
    toCeil(num) {
      let val = new Decimal(num).mul(100)
      return Math.ceil(val) / 100
    },
    deleteSize(index) {
      this.form.sizes.splice(index, 1)
    },
    deleteSizeChildren(index, indexx) {
      if (this.form.sizes[index].children.length > 1) {
        this.form.sizes[index].children.splice(indexx, 1)
      } else {
        this.deleteSize(index)
      }
    },
    findSkuFromRaw(size1) {
      if (!this.goodsRaw || this.initedSku) {
        return
      }
      return (
        this.goodsRaw.skus.find(sku => {
          const size = sku.skuNo
            .split('_')
            .slice(1)
            .join('')
          return size === size1
        }) || {}
      )
    },
    updateRows() {
      const rows = []
      if (this.form.sizes.length === 0) {
        this.form.skus = rows
        return
      }
      let i = 0

      this.skusRaw = JSON.parse(JSON.stringify(this.form.skus))

      if (this.form.sizes.length === 1) {
        for (const index in this.form.sizes[0].children) {
          const size = this.form.sizes[0].children[index]
          const sku = this.findSkuFromRaw(size.name, size.name) || this.findSkuFromSkusRaw(i) || {}
          i++
          const skusId = `${this.form.sizes[0].name}_${size.name}`
          rows.push({
            commissionType: this.commissionType,
            promoteCommission: '',
            image: '',
            shareCommission: '',
            linePrice: '',
            retailPrice: '',
            marketPrice: '',
            price: '',
            number: '',
            ...sku,
            specifications: [{ name: this.form.sizes[0].name, value: size.name }],
            p1: size.name,
            id: i,
            skusId
          })
        }
      }
      if (this.form.sizes.length >= 2) {
        let sp = this.form.sizes.map((item, index) => ({
          id: index + 1,
          value: item.name,
          leaf: item.children.map((val, i) => ({
            id: index + 1 + '' + (i + 1),
            value: val.name
          }))
        }))
        const format = this.flatten(sp)
        format.forEach((val, idx) => {
          const skusId = val.skus.map(items => `${items.name}_${items.value}`)
          const v = val.skus
            .map(vals => vals.v)
            .sort()
            .join('')
          const sku = this.findSkuFromRaw(v) || this.findSkuFromSkusRaw(i) || {}
          i++
          rows.push({
            commissionType: this.commissionType,
            promoteCommission: '',
            image: '',
            shareCommission: '',
            linePrice: '',
            retailPrice: '',
            marketPrice: '',
            price: '',
            number: '',
            ...sku,
            specifications: val.skus,
            p1: val.skus[0].v,
            id: i,
            skusId
          })
        })
      }
      this.commissionType = rows[0].commissionType || 2
      this.form.skus = rows
    },
    findSkuFromSkusRaw(index) {
      return this.skusRaw[index]
    },
    getLevels(tree) {
      let level = []
      for (let i = tree.length - 1; i >= 0; i--) {
        if (tree[i + 1] && tree[i + 1].leaf) {
          level[i] = tree[i + 1].leaf.length * level[i + 1] || 1
        } else {
          level[i] = 1
        }
      }
      return level
    },
    flatten(tree, stocks = [], options) {
      let { optionValue = 'id', optionText = 'value' } = options || {}
      let result = []
      let skuLen = 0
      let stockMap = {} // 记录已存在的stock的数据
      const level = this.getLevels(tree)
      if (tree.length === 0) return result
      tree.forEach(sku => {
        const { leaf } = sku
        if (!leaf || leaf.length === 0) return true
        skuLen = (skuLen || 1) * leaf.length
      })
      // 根据已有的stocks生成一个map
      stocks.forEach(stock => {
        let { skus, ...attr } = stock
        stockMap[skus.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr
      })
      for (let i = 0; i < skuLen; i++) {
        let skus = []
        let mapKey = []
        tree.forEach((sku, column) => {
          const { leaf } = sku
          let item = {}
          if (!leaf || leaf.length === 0) return true
          if (leaf.length > 1) {
            let row = parseInt(i / level[column], 10) % leaf.length
            item = tree[column].leaf[row]
          } else {
            item = tree[column].leaf[0]
          }
          if (!sku[optionValue] || !item[optionValue]) return
          mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
          skus.push({
            k_id: sku[optionValue],
            k: sku[optionText],
            v_id: item[optionValue],
            v: item[optionText],
            name: sku[optionText],
            value: item[optionText]
          })
        })
        let { ...data } = stockMap[mapKey.join('|')] || {}
        // 从map中找出存在的sku并保留其值
        result.push({ ...data, skus })
      }
      return result
    },
    setRows() {
      let newBatchSetting = {}
      for (const i in this.batchSetting) {
        if (this.batchSetting[i] !== '') {
          newBatchSetting[i] = this.batchSetting[i]
        }
      }
      let sizename = []
      for (const idx in this.sizeSetting) {
        if (this.sizeSetting[idx] !== '全部') {
          sizename.push(`${this.form.sizes[idx].name}_${this.sizeSetting[idx]}`)
        }
      }
      const rows = this.form.skus.map(it => {
        if (sizename.length === 0) {
          return { ...it, ...newBatchSetting }
        } else {
          if (this.listIntersection(sizename, it.skusId)) return { ...it, ...newBatchSetting }
        }
        return it
      })
      let isRule = true
      rows.forEach((v, i) => {
        if (v.number < 0) {
          isRule = false
          this.$message.error('库存不能少于0，请重新输入！')
          return
        }
        if (v.number % 1 !== 0) {
          isRule = false
          this.$message.error('库存只能为整数，请重新输入！')
          return
        }
        if (v.price < 0) {
          isRule = false
          this.$message.error('价格不能少于0，请重新输入！')
          return
        }
        if (v.retailPrice < 0) {
          isRule = false
          this.$message.error('建议零售价不能少于0，请重新输入！')
          return
        }
        if (v.linePrice < 0) {
          isRule = false
          this.$message.error('划线价格不能少于0，请重新输入！')
          return
        }
        if (v.marketPrice < 0) {
          isRule = false
          this.$message.error('成本价格不能少于0，请重新输入！')
          return
        }
        if (v.promoteCommission === '' && process.env.VUE_APP_PROJECT_TYPE === 'YUNPI') {
          isRule = false
          this.$message.error(`请填写${this.promoteName}佣金`)
          return
        }
        if (v.shareCommission === '' && process.env.VUE_APP_PROJECT_TYPE === 'YUNPI') {
          isRule = false
          this.$message.error(`请填写${this.shareName}佣金`)
          return
        }
        if (v.promoteCommission < 0) {
          isRule = false
          this.$message.error(`${this.promoteName}佣金不能少于0，请重新输入！`)
          return
        }
        if (v.shareCommission < 0) {
          isRule = false
          this.$message.error(`${this.shareName}佣金不能少于0，请重新输入！`)
          return
        }
        v.number = Number(v.number)
        v.promoteCommission = this.filterPrice(v.promoteCommission)
        v.shareCommission = this.filterPrice(v.shareCommission)
        v.price = this.filterPrice(v.price)
        v.linePrice = this.filterPrice(v.linePrice)
        v.marketPrice = this.filterPrice(v.marketPrice)
        v.retailPrice = this.filterPrice(v.retailPrice)
      })
      if (isRule === false) return false
      this.form.skus = rows
      this.$nextTick(() => this.$forceUpdate())
    },
    async fetchCategories() {
      const { data } = await categoryApi.list()
      this.categories = data.categories
    },
    async uploadBannerImage(e) {
      try {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        const url = await upyun.upload(formData)
        this.form.imagesUrl.push(upyun.url(url))
        this.form.images.push(url)
      } finally {
        this.$refs.bannerForm.reset()
      }
    },
    filterPrice(num) {
      let val = parseFloat(num || 0)
      const min = 0.1
      if (val !== 0) {
        val = (val < min ? min : val).toFixed(2)
      }
      return val
    },
    listIntersection(targetList, list) {
      // 查找两个数组的交集
      let targetLength = targetList.length
      let existList = targetList.filter(val => {
        return list.indexOf(val) > -1
      })
      return targetLength === existList.length
    },
    removeBannerImages(index) {
      this.form.imagesUrl.splice(index, 1)
      this.form.images.splice(index, 1)
    },
    async uploadDetailImage(e) {
      try {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        const url = await upyun.upload(formData)
        this.form.detailImages.push(url)
        this.form.detailImagesUrl.push(upyun.url(url))
      } finally {
        this.$refs.detailImageForm.reset()
      }
    },
    async uploadSkusImage(e, i) {
      Vue.set(this.form.skus[i], 'isLoading', true)
      try {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        const url = await upyun.upload(formData)
        this.form.skus[i].image = url
        this.form.skus[i].imageUrl = upyun.url(url)
        this.form.skus[i].isLoading = false
      } finally {
        this.form.skus[i].isLoading = false
        // this.$refs.detailImageForm.reset()
      }
    },
    delSkusImage(index) {
      this.form.skus[index].image = ''
      this.form.skus[index].imageUrl = ''
      event.stopPropagation()
    },
    removeDetailImages(index) {
      this.form.detailImages.splice(index, 1)
      this.form.detailImagesUrl.splice(index, 1)
    },
    mapImagesFromRaw(images, field) {
      if (!this.goodsRaw) {
        return images
      }
      const imagesRaw = this.goodsRaw.imagesData[field] || []
      return images.map(it => {
        const obj = imagesRaw.find(obj => obj.image === it)
        if (obj) {
          return obj
        } else {
          return { id: '', image: it }
        }
      })
    },
    async submit() {
      if (this.form.name.trim() === '') {
        this.$message.error('请输入商品名！')
        return
      }
      if (this.form.images.length === 0) {
        this.$message.error('请上传图片！')
        return
      }
      // if (+this.form.promiseExpressTime === 3 && this.form.promiseExpressTimeVal === '') {
      //   this.$message.error('请输入发货时间！')
      //   return
      // }
      // if (+this.form.promiseRefundType === 1 && this.form.promiseRefundReason === '') {
      //   this.$message.error('请输入退货理由！')
      //   return
      // }
      await this.$refs.form.validate()
      this.form.promiseExpressTime_val = this.form.promiseExpressTimeVal
      const form = { ...this.form }
      // form.skus = form.skus.filter((row) => row.price && row.number)
      let isRule = true
      form.skus.forEach((v, i) => {
        if (this.goodsModel > 0) {
          const nameList = v.specifications.filter(item => item.name.trim() === '')
          const valueList = v.specifications.filter(item => item.value.trim() === '')
          if (nameList.length > 0) {
            isRule = false
            this.$message.error('请输入规格名称')
            return
          }
          if (valueList.length > 0) {
            isRule = false
            this.$message.error('请输入选项名称')
            return
          }
        } else {
          v.specifications = []
        }
        if (v.number < 0 || v.number === '') {
          isRule = false
          this.$message.error('库存不能少于0，请重新输入！')
          return
        }
        if (v.number % 1 !== 0) {
          isRule = false
          this.$message.error('库存只能为整数，请重新输入！')
          return
        }
        if (v.price < 0 || v.price === '') {
          isRule = false
          this.$message.error('价格不能少于0，请重新输入！')
          return
        }
        if (v.linePrice < 0) {
          isRule = false
          this.$message.error('划线价格不能少于0，请重新输入！')
          return
        }
        if (v.retailPrice < 0) {
          isRule = false
          this.$message.error('建议零售价格不能少于0，请重新输入！')
          return
        }
        if (v.marketPrice < 0) {
          isRule = false
          this.$message.error('成本价格不能少于0，请重新输入！')
          return
        }
        if (v.promoteCommission === '' && process.env.VUE_APP_PROJECT_TYPE === 'YUNPI') {
          isRule = false
          this.$message.error(`请填写${this.promoteName}佣金`)
          return
        }
        if (v.shareCommission === '' && process.env.VUE_APP_PROJECT_TYPE === 'YUNPI') {
          isRule = false
          this.$message.error(`请填写${this.shareName}佣金`)
          return
        }
        if (v.promoteCommission < 0) {
          isRule = false
          this.$message.error(`${this.promoteName}佣金不能少于0，请重新输入！`)
          return
        }
        if (v.shareCommission < 0) {
          isRule = false
          this.$message.error(`${this.shareName}佣金不能少于0，请重新输入！`)
          return
        }
        if (v.paid_price < 0) {
          Vue.set(this.form.skus[i], 'warn_style', true)
          isRule = false
          this.$message.error('利润不能少于0，请重新输入！')
          return
        }
        v.promoteCommission = this.filterPrice(v.promoteCommission)
        v.shareCommission = this.filterPrice(v.shareCommission)
        v.price = this.filterPrice(v.price)
        v.linePrice = this.filterPrice(v.linePrice)
        v.marketPrice = this.filterPrice(v.marketPrice)
        v.retailPrice = this.filterPrice(v.retailPrice)
        if (v.shareCommission !== '') {
          v.commissionType = this.commissionType
        }
      })
      if (isRule === false) return false

      const images = form.imagesUrl.map(it => upyun.obj(it).replace(/^\//, ''))
      const detailImages = form.detailImagesUrl.map(it => upyun.obj(it).replace(/^\//, ''))
      form.images = this.mapImagesFromRaw(images, 'images')
      form.detailImages = this.mapImagesFromRaw(detailImages, 'images')

      delete form.specifications
      const that = this
      try {
        const isBlank = isNumber(form.skus)
        if (isBlank) {
          this.$confirm({
            title: '该商品库存为0，确认上架吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              that.sendGoods(form)
            },
            onCancel: () => {
              console.log('取消操作')
            }
          })
        } else {
          that.sendGoods(form)
        }
      } catch (e) {
        await that.$message.error(e.message)
      }
    },
    async sendGoods(form) {
      this.subLoading = true
      let result
      this.form.brandName = this.form.brandName.trim()
      if (this.form.goodsNo) {
        if (this.form.isOmsGoods) form.omsGoodsId = this.form.goodsNo
        form.online = true
        form.goodsModel = this.goodsModel
        result = await goodsApi[this.form.isOmsGoods ? 'omsGoodsUpdate' : 'update'](this.form.goodsNo, form)
      } else {
        form.goodsModel = this.goodsModel
        result = await goodsApi.create(form)
      }
      if (result.meta.code === 0) {
        await this.$message.success('操作成功')
        this.$router.push({
          path: '/products'
        })
      }
        this.subLoading = false
    },
    async appendCategory() {
      await this.$refs.category.validate()
      await categoryApi.create(this.category)
      this.closeCategoryModal()
      this.fetchCategories()
    },
    closeCategoryModal() {
      this.$refs.category.resetFields()
      this.categoryModalVisible = false
    },
    onTimeChange(e) {
      const val = +e.target.value
      if (val !== 3) {
        this.form.promiseExpressTimeVal = ''
      }
    },
    onDescriptionChange(e) {
      const val = +e.target.value
      if (val !== 1) {
        this.form.promiseRefundReason = ''
      }
    },
    onCommissionChange(e) {
      this.form.skus.forEach(v => {
        v.commissionType = +e.target.value
        v.shareCommission = 0
        v.promoteCommission = 0
      })
    },
    onModeChange(e) {
      this.goodsModel = +e.target.value
      if (+e.target.value === 2) {
        this.addSize(2)
      } else {
        this.addSize(1)
      }
    }
  }
}
</script>

<style lang="less">
.ant-form-item-control {
  width: 100%;
}
.banners > span {
  display: flex;
  flex-wrap: wrap;
}
.w-100 > div {
  width: 100% !important;
}
</style>

<style lang="less" scoped>
@import '~ant-design-vue/dist/antd.less';
.card:not(:first-child) {
  margin-top: 20px;
}
.radioGroup-style {
  margin-top: 10px;
  margin-bottom: 20px;
}
.flex {
  display: flex;
}
.div-flex {
  width: 100%;
  display: flex;
  .div-flex-child {
    margin-right: 10px;
  }
}
.options-ml20 {
  margin-left: 30px;
}
.banners {
  display: flex;
  flex-wrap: wrap;
  // margin-left: 20px;
}
.banner-area {
  display: flex;
  flex-wrap: wrap;
}
.banner-area > .banner {
  cursor: pointer;
}
.banner {
  width: 150px;
  height: 150px;
  padding: 20px;
  border-radius: 3px;
  margin-right: 20px;
  margin-bottom: 20px;
  border: 2px dashed #d9d9d9;
  position: relative;
  font-size: 18px;
  display: flex;
  align-items: center;
  opacity: 1;
  justify-content: center;
  & > div {
    text-align: center;
  }
}
.banners .banner {
  &:hover {
    cursor: move;
    color: @primary-color;
    border: 2px dashed @primary-color;
    .banner-delete {
      color: @primary-color;
    }
  }
}
.banner > img {
  width: 130px;
  height: 130px;
}
.banner-delete {
  position: absolute;
  right: -10px;
  top: -20px;
  color: #6e6e6e;
  font-size: 18px;
  z-index: 1;
  & > i {
    background: #fff;
    cursor: pointer;
  }
}
.size-action {
  margin-left: 20px;
}
.skus {
  margin-top: 20px;
}
.submit-btn {
  text-align: center;
}
.inputNumStyle {
  width: 100%;
}
.span-style {
  display: inline-block;
  margin-right: 30px !important;
}
.paid_price_style {
  margin-left: 20px;
}
.box {
  border-radius: 15px;
  border: 1px solid #001529;
  padding: 20px;
  padding-bottom: 0;
  margin-bottom: 20px;
  position: relative;
  .close-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    background-image: url(https://assets-gewu.bagrids.com/images/goods_edit_del.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    right: -15px;
    top: -15px;
  }
}
.skusImage {
  width: 68px;
  height: 68px;
  border-radius: 3px;
  border: 2px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .input-skus {
    width: 100%;
    height: 100%;
  }
  .img-skus {
    width: 68px;
    height: 68px;
    border-radius: 3px;
  }
  .del {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -10px;
    top: -9px;
    background-image: url('../../assets/skus-del-icon.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
