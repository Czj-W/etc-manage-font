<template>
  <div>
    <a-card>
      <div class="order__header">
        <div>
          <div>状态</div>
          <div class="order--status">{{ order.orderStatus }}</div>
        </div>
        <div>
          <a-button v-if="shipable" type="primary" @click="ship.visible = true">发货</a-button>
          <a-button v-if="refundable" @click="refund.visible = true; refund.amount = order.price">退款</a-button>
          <a-button v-if="refundable" @click="rejectRefund.visible = true">拒绝</a-button>
        </div>
      </div>
      <div class="content__item">
        <a-row>
          <a-col :span="24">
            <h3>
              <span>供货商退款记录(供货商退款记录)</span>
            </h3>
          </a-col>
        </a-row>
        <div>
          <a-row>
            <a-col :span="24" class="buyer">
              <div class="buyer__message">2020-07-20   18:56:21</div>
            </a-col>
          </a-row>
          <a-row class="buyer">
            <a-col :span="8">
              <div>
                退款状态
                <b>已拒绝</b>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                原因
                <b>请收到货后再发出申请</b>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="content__item">
        <a-row>
          <a-col :span="24">
            <h3>
              <span>申请记录(买家申请记录)</span>
            </h3>
          </a-col>
        </a-row>
        <div>
          <a-row>
            <a-col :span="24" class="buyer">
              <div class="buyer__message">2020-07-20   18:56:21</div>
            </a-col>
          </a-row>
          <a-row class="buyer">
            <a-col :span="6">
              <div>
                申请类型
                <b>我要退款（无需退货）</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                申请原因
                <b>不喜欢/不想要</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                退款金额
                <b>¥150</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                申请说明
                <b>就是不想要了</b>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="buyer">
              凭证
              <div class="buyer__message">
                <a-row type="flex" justify="space-around">
                  <a-col :span="4">
                    <img src="http://assets-gewu.bagrids.com/images/tmp_f4180195d3c941ecb0c340d0d709c4790d29ce8ea97c169b.jpg" class="max-img" alt="">
                  </a-col>
                  <a-col :span="4">
                    <img src="http://assets-gewu.bagrids.com/images/tmp_f4180195d3c941ecb0c340d0d709c4790d29ce8ea97c169b.jpg" class="max-img" alt="">
                  </a-col>
                  <a-col :span="4">
                    <img src="http://assets-gewu.bagrids.com/images/tmp_f4180195d3c941ecb0c340d0d709c4790d29ce8ea97c169b.jpg" class="max-img" alt="">
                  </a-col>
                  <a-col :span="4">
                    <img src="http://assets-gewu.bagrids.com/images/tmp_f4180195d3c941ecb0c340d0d709c4790d29ce8ea97c169b.jpg" class="max-img" alt="">
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
          <a-divider />
        </div>
      </div>
      <div class="content__item">
        <a-row>
          <a-col :span="24">
            <h3>
              <span>退款记录(商家退款记录)</span>
            </h3>
          </a-col>
        </a-row>
        <div>
          <a-row>
            <a-col :span="24" class="buyer">
              <div class="buyer__message">2020-07-20   18:56:21</div>
            </a-col>
          </a-row>
          <a-row class="buyer">
            <a-col :span="8">
              <div>
                退款状态
                <b>向供货商申请退款</b>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                原因
                <b>123123123123</b>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="order__content">
        <div class="content__item">
          <h3>订单信息</h3>
          <a-row>
            <a-col :span="24">
              <a-table
                bordered
                :columns="columns"
                :data-source="data"
                :pagination="false"
                :rowKey="row => row.goodsNo"
              >
                <template slot="title" slot-scope="currentPageData">
                  <div class="table__header">
                    <div>订单编号：{{ currentPageData[0] && currentPageData[0].orderNo }}</div>
                    <div>下单时间：{{ currentPageData[0] && currentPageData[0].createdAt }}</div>
                  </div>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </div>
        <div class="content__item">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>收货信息</span>
                <a-button class="btn--copy" v-clipboard:copy="copyValue">复制</a-button>
              </h3>
            </a-col>
          </a-row>
          <div>
            <a-row>
              <a-col :span="8">
                <div>
                  收货人：
                  <b>{{ order.expressName }}</b>
                </div>
              </a-col>
              <a-col :span="8">
                <div>
                  联系电话：
                  <b>{{ order.expressPhone }}</b>
                </div>
              </a-col>
              <a-col :span="8">
                <div>
                  收货地址：
                  <b>{{ order.expressAddress }}</b>
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24" class="buyer">
                <div>买家留言：</div>
                <div class="buyer__message">{{ order.message && order.message.join(", ") }}</div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="content__item">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>分销信息</span>
              </h3>
            </a-col>
          </a-row>
          <div>
            <a-row :gutter="48" class="saler">
              <a-col :span="4">
                <div>
                  <div>分销员</div>
                  <div>
                    <b>{{ order.sellerInfo && order.sellerInfo.nickname }}</b>
                  </div>
                </div>
              </a-col>
              <a-col :span="8" v-if="order.sellerInfo">
                <div>
                  <div>分销{{ title }}</div>
                  <div>
                    <b>{{ order.shareDistributor.nickname ? `${order.shareDistributor.nickname}的${title}` : '-' }}</b>
                  </div>
                </div>
              </a-col>
              <a-col :span="8">
                <div>
                  <div>此单获得佣金</div>
                  <div>
                    <b>{{ order.shareDistributor && order.shareDistributor.realCommission }}</b>
                  </div>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="48" class="saler">
              <a-col :span="4">
                <div>推广员</div>
                <div>
                  <b>{{ order.promoDistributor && order.promoDistributor.nickname }}</b>
                </div>
              </a-col>
              <a-col :span="8">
                <div>此单获得推广佣金</div>
                <div>
                  <b>{{ order.promoDistributor && order.promoDistributor.realCommission }}</b>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="content__item">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>发货信息</span>
              </h3>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <span>发货信息：{{ order.messageSaler && order.messageSaler.join(", ") }}</span>
            </a-col>
          </a-row>
        </div>
        <div class="content__item" v-if="order.appeal">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>申请记录</span>
              </h3>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <div>
                状态：
                <b>{{ order.appeal.statusName || '-' }}</b>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                金额：
                <b>{{ order.appeal.refundPrice || '-' }}</b>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                提交时间：
                <b>{{ order.appeal.createdAt || '-' }}</b>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="refund">
              <div>备注：</div>
              <div class="refund__remark">{{ order.appeal.mark || '-' }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
    <a-modal v-model="ship.visible" title="发货" @ok="submitShip" @cancel="cancelShip">
      <a-form-model ref="ship" :model="ship" :rules="ship.rules">
        <a-form-model-item label="请输入发货说明" prop="remark">
          <a-textarea v-model="ship.remark"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal v-model="refund.visible" title="退款" @ok="submitRefund" @cancel="cancelRefund">
      <a-form-model ref="refund" :model="refund" :rules="refund.rules">
        <a-form-model-item label="请输入退款金额" prop="amount">
          <a-input v-model="refund.amount" disabled>
            <a slot="suffix" @click="refund.amount = order.price">全部金额</a>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="refund.remark"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="rejectRefund.visible"
      title="拒绝"
      @ok="submitRejectRefund"
      @cancel="cancelRejectRefund"
    >
      <a-form-model ref="rejectRefund" :model="rejectRefund" :rules="rejectRefund.rules">
        <p class="text-center">确认拒接买家的退款申请吗？</p>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="rejectRefund.remark"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  getOrder,
  ship,
  refund,
  refundRefuse,
  ORDER_STATUS_PAID,
  EXPRESS_STATUS_UNSHIP,
  REFUND_STATUS_APPEALING
} from '@/api/orders'

export default {
  data() {
    return {
      title: '',
      order: {},
      data: [],
      refund: {
        rules: {
          amount: [
            { required: true, message: '请填写退款金额', trigger: 'blur' },
            {
              validator: (rule, value, cb) => {
                let message = ''
                if (/^\d+((\.\d{1,2})?)$/.test(value)) {
                  cb()
                } else {
                  message = '金额错误'
                  cb(message)
                }
              }
            }
          ]
        },
        visible: false,
        amount: '',
        remark: ''
      },
      ship: {
        rules: {
          remark: [{ required: true, message: '请输入发货说明', trigger: 'blur' }]
        },
        visible: false,
        remark: ''
      },
      rejectRefund: {
        rules: {
          remark: [{ required: true, message: '拒绝退款备注', trigger: 'blur' }]
        },
        visible: false,
        remark: ''
      },
      columns: [
        {
          title: '商品信息',
          customRender: (text, row, index) => {
            if (!row.orderGoods) {
              return
            }
            return {
              children: (
                <div>
                  {row.orderGoods.map(goods => (
                    <div class="row product">
                      <div class="product_item">
                        <img class="product__cover" src={goods.listPicUrl} />
                        <p class="product__info">{goods.goodsName}</p>
                        <a-tag color="orange">供销商品</a-tag>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          }
        },
        {
          title: '规格',
          customRender: (text, row, index) => {
            if (!row.orderGoods) {
              return
            }
            return {
              children: (
                <div>
                  {row.orderGoods.map(goods => (
                    <div class="row">
                      <p class="product__info">{goods.specification.map(it => it.value).join('/')}</p>
                    </div>
                  ))}
                </div>
              )
            }
          }
        },
        {
          title: '商品销售单价',
          customRender: (text, row, index) => {
            return `￥${row.price}`
          }
        },
        {
          title: '数量',
          dataIndex: 'number'
        },
        {
          title: '商品总价',
          customRender: (text, row, index) => {
            return `￥${row.totalPrice}`
          }
        },
        {
          title: '红包优惠',
          customRender: (text, row, index) => {
            return row.couponTitle ? `${row.couponTitle}` : '无'
          }
        },
        {
          title: '来源',
          customRender: (text, row, index) => {
            return row.salerInfo.nickname ? `${row.salerInfo.nickname}的${this.title}` : '-'
          }
        },
        {
          title: '商家实收金额',
          customRender: (text, row, index) => {
            return (
              <div>
                ¥{row.totalPriceAfterCommision}
                <a-popover placement="right">
                  <template slot="content">
                    <p>售价： ¥{row.totalPrice}</p>
                    <p>{row.isSelfBuy ? '自购优惠' : '分销奖励'}：¥{row.totalCommission}</p>
                    <p>红包优惠：¥{row.couponPrice}</p>
                    <p>平台手续费：¥({row.serviceFee})(含微信支付手续费)</p>
                  </template>
                  <a-icon class="tips-icon" type="info-circle" />
                </a-popover>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    shipable() {
      return this.order.status === ORDER_STATUS_PAID && this.order.expressStatus === EXPRESS_STATUS_UNSHIP
    },
    refundable() {
      return this.order.status === REFUND_STATUS_APPEALING
    },
    copyValue() {
      return `收货人: ${this.order.expressName}\n电话: ${this.order.expressPhone}\n地址: ${this.order.expressAddress}`
    }
  },
  methods: {
    async fetchOrder() {
      const { data } = await getOrder(this.$route.params.id)
      this.order = data
      this.data = [data]
    },
    async submitRefund() {
      await this.$refs.refund.validate()
      try {
        await refund(this.order.orderNo, {
          mark: this.refund.remark
        })
        this.$message.success('操作成功')
        this.fetchOrder()
        this.closeRefundModel()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    closeRefundModel() {
      this.refund.visible = false
      this.cancelRefund()
    },
    cancelRefund() {
      this.$refs.refund.resetFields()
    },
    async submitRejectRefund() {
      await this.$refs.rejectRefund.validate()
      try {
        await refundRefuse(this.order.orderNo, {
          mark: this.rejectRefund.remark
        })
        this.$message.success('操作成功')
        this.fetchOrder()
        this.closeRejectRefundModel()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    closeRejectRefundModel() {
      this.rejectRefund.visible = false
      this.cancelRejectRefund()
    },
    cancelRejectRefund() {
      this.$refs.rejectRefund.resetFields()
    },
    async submitShip() {
      await this.$refs.ship.validate()
      try {
        await ship(this.order.orderNo, {
          message: this.ship.remark
        })
        this.$message.success('发货成功')
        this.fetchOrder()
        this.closeShipModel()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    closeShipModel() {
      this.ship.visible = false
      this.cancelShip()
    },
    cancelShip() {
      this.$refs.ship.resetFields()
    }
  },
  mounted() {
    this.fetchOrder()
  },
  created () {
    this.title = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '云铺' : '格子铺'
  }
}
</script>

<style lang="less" scoped>
@import './style.less';

.max-img {
  width: 100%;
}
.order__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order--status {
  font-size: 24px;
  font-weight: 400;
  color: #000;
}
.order__content {
  margin-top: 30px;
}
.table__header {
  display: flex;
  justify-content: space-between;
}
.content__item:not(:first-child) {
  margin-top: 30px;
}
.btn--copy {
  margin-left: 20px;
}
.buyer,
.refund {
  margin-top: 20px;
  display: flex;
}
.buyer__message,
.refund__remark {
  flex: 1;
}
.saler:not(:first-child) {
  margin-top: 30px;
}
.tips-icon {
  color: #feb037;
  margin-left: 10px;
}
</style>
