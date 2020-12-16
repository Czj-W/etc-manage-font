<template>
  <div>
    <a-modal v-model="address.visible" title="编辑买家信息" @ok="submitChangeAddress" @cancel="cancelChangeAddress">
      <a-form-model
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="address"
        :model="address"
        :rules="address.rules"
      >
        <a-form-model-item label="所在地区" prop="expressArea">
          <cascader
            :options="area.area || []"
            :fieldNames="fieldNames"
            placeholder="请选择省市区"
            @change="onChangeArea"
          />
        </a-form-model-item>
        <a-form-model-item label="收货地址" prop="expressAddress">
          <a-input v-model="address.expressAddress"></a-input>
        </a-form-model-item>
        <a-form-model-item label="收货人" prop="expressName">
          <a-input v-model="address.expressName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="expressPhone">
          <a-input v-model="address.expressPhone"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal v-model="express.visible" title="请确认您的退货信息" @ok="submitRefundExpress" @cancel="cancelExpress">
      <a-form-model
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="express"
        :model="express"
        :rules="express.rules"
      >
        <a-form-model-item label="收货人地址" prop="merchant_express_address">
          <a-input v-model="express.merchant_express_address"></a-input>
        </a-form-model-item>
        <a-form-model-item label="收货人姓名" prop="merchant_express_name">
          <a-input v-model="express.merchant_express_name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="收货人号码" prop="merchant_express_phone">
          <a-input v-model="express.merchant_express_phone"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal v-model="ship.visible" title="发货" @ok="submitShip" @cancel="cancelShip">
      <div class="tac mb_20">
        <a-radio-group v-model="wuliuStatus" button-style="solid">
          <a-radio-button value="yes">物流发货</a-radio-button>
          <a-radio-button value="no">无物流发货</a-radio-button>
        </a-radio-group>
      </div>
      <a-form-model
        ref="ship"
        :model="ship"
        :rules="ship.rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="wuliuStatus === 'yes'"
      >
        <a-form-model-item label="运单编号" prop="expressOrderNo">
          <a-input placeholder="请输入快递单号" v-model="ship.expressOrderNo"></a-input>
        </a-form-model-item>
        <a-form-model-item label="请选择快递" prop="expressType">
          <a-select v-model="ship.expressType" placeholder="请输入发货说明">
            <a-select-option :value="kwai.value" v-for="kwai in kwaiOptions" :key="kwai.name">{{
              kwai.name
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="请输入发货说明" prop="messageSaler">
          <a-textarea v-model="ship.messageSaler" placeholder="请输入发货说明"></a-textarea>
        </a-form-model-item>
      </a-form-model>
      <p v-else>不用填写物流信息</p>
    </a-modal>
    <a-card>
      <div class="order__header">
        <div>
          <div>状态</div>
          <div class="order--status">
            {{ order.orderStatus }}{{ $route.query.entryType === 'afterSale' ? `，${data[0].appeal.statusName}` : '' }}
          </div>
        </div>
        <div v-if="!isHomaHo || !order.isOmsOrder">
          <div class="mb_20" v-if="omsApplyStatus">
            <span>请先向供货商发起申请：</span>
            <a-popconfirm
              placement="left"
              title="确定向供货商申请退款退货?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="submitOmsApply"
              @cancel="cancel"
            >
              <a-button type="primary" :loading="omsApplyLoading">{{
                appeal.appealType === 1 ? '向供货商申请退款' : '向供货商申请退款退货'
              }}</a-button>
            </a-popconfirm>
          </div>
          <div v-else>
            <span
              v-if="$route.query.entryType !== 'Order' && order.isAppeal && order.isOmsOrder"
            >请先向供货商发起申请：</span
            >
            <a-button
              class="mb_20"
              v-if="$route.query.entryType !== 'Order' && order.isAppeal && order.isOmsOrder"
              disabled
            >{{ appeal.appealType === 1 ? '向供货商申请退款' : '向供货商申请退款退货' }}</a-button
            >
          </div>
          <div class="mb_20" v-if="canceLOrderStatus">
            <a-popconfirm
              placement="left"
              title="确定取消该订单?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="cancelOrder"
              @cancel="cancelOrderOperate"
            >
              <a-button type="primary" :loading="cancelLoading">取消订单</a-button>
            </a-popconfirm>
          </div>
          <span v-if="appealTypeStatus || refundable">处理用户售后结果：</span>
          <a-button v-if="shipable" type="primary" @click="ship.visible = true">发货</a-button>
          <a-button v-if="appealTypeStatus" @click="rejectRefund.visible = true">拒绝申请</a-button>
          <a-button class="btn-style" v-if="appealTypeStatus" @click="operateApply()">同意申请</a-button>
          <a-button class="btn-style" v-if="refundable" @click="rejectRefund.visible = true">拒绝</a-button>
          <a-button
            v-if="refundable"
            type="primary"
            @click="
              refund.visible = true
              refund.amount = order.refundPrice
            "
          >退款</a-button
          >
        </div>
      </div>
      <div class="content__item" v-if="order.isOmsOrder && afterSaleList.length && $route.query.entryType !== 'Order'">
        <a-row>
          <a-col :span="24">
            <h3>
              <span>供货商退款记录(供货商退款记录)</span>
            </h3>
          </a-col>
        </a-row>
        <div v-for="item_sale in afterSaleList" :key="item_sale.id">
          <a-row>
            <a-col :span="24" class="buyer">
              <div class="buyer__message">{{ item_sale.createAt }}</div>
            </a-col>
          </a-row>
          <a-row class="buyer">
            <a-col :span="8">
              <div>
                退款状态
                <b>{{ item_sale.status | saleStatus }}</b>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                原因
                <b>{{ item_sale.auditRemark }}</b>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="content__item" v-if="$route.query.entryType !== 'Order'">
        <a-row>
          <a-col :span="24">
            <h3>
              <span>申请记录(买家申请记录)</span>
            </h3>
          </a-col>
        </a-row>
        <div v-for="(item_appeal, index) in order.appeals" :key="index">
          <a-row>
            <a-col :span="24" class="buyer">
              <div class="buyer__message">{{ item_appeal.createdAt || '' }}</div>
            </a-col>
          </a-row>
          <a-row class="buyer">
            <a-col :span="6">
              <div>
                申请类型
                <b>{{
                  item_appeal.appealType && item_appeal.appealType === 1 ? '我要退款（无需退货）' : '我要退货退款'
                }}</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                申请原因
                <b>{{ item_appeal.appealReasonCn || '--' }}</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                退款金额
                <b>¥{{ item_appeal.refundPrice || 0 }}</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                申请说明
                <b>{{ item_appeal.mark || 0 }}</b>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" class="buyer">
              凭证
              <div class="buyer__message img_list">
                <img
                  v-for="img in item_appeal.orderAppealImages"
                  :src="img"
                  :key="img"
                  @click="handlePreview(img)"
                  class="item"
                  alt="凭证"
                />
              </div>
            </a-col>
          </a-row>
          <a-divider />
        </div>
      </div>
      <div class="content__item" v-if="$route.query.entryType !== 'Order'">
        <a-row>
          <a-col :span="24">
            <h3>
              <span>退款记录</span>
            </h3>
          </a-col>
        </a-row>
        <div>
          <a-row>
            <a-col :span="24" class="buyer">
              <div class="buyer__message">{{ appeal.createdAt || '--' }}</div>
            </a-col>
          </a-row>
          <a-row class="buyer">
            <a-col :span="6">
              <div>
                退款状态
                <b>{{ appeal.statusName || '--' }}</b>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                原因
                <b>{{ appeal.merchantRemark || '--' }}</b>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="order__content">
        <div class="content__item">
          <h3>订单信息</h3>
          <!-- <a-row>
          <a-col :span="24">-->
          <a-table
            bordered
            :columns="order.isOmsOrder ? columns : columns.filter(item => item.title !== '商品成本价')"
            :data-source="data"
            :pagination="false"
            :rowKey="row => row.goodsNo"
            :scroll="{ x: 1500 }"
          >
            <template slot="title" slot-scope="currentPageData">
              <div class="table__header">
                <div>订单编号：{{ currentPageData[0] && currentPageData[0].orderNo }}</div>
                <div v-if="$route.query.entryType !== 'Order'">退款订单号：{{ appeal.appealNo || '' }}</div>
                <div v-if="$route.query.entryType !== 'Order'">售后申请时间：{{ appeal.createdAt || '--' }}</div>
                <div v-if="$route.query.entryType === 'Order'">
                  下单时间：{{ currentPageData[0] && currentPageData[0].createdAt }}
                </div>
              </div>
            </template>
          </a-table>
          <!-- </a-col>
          </a-row>-->
        </div>
        <div class="content__item">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>收货信息</span>
                <a-button
                  class="btn--copy"
                  v-clipboard:copy="copyValue"
                  v-clipboard:success="clipboardSuccessHandler"
                  v-clipboard:error="clipboardErrorHandler"
                >复制</a-button
                >
                <a-button @click="changeAddress" v-if="changeAddressStatus">修改地址</a-button>
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
                <div class="buyer__message">
                  {{ order.message && order.message.filter(item => item !== '').join(', ') }}
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="content__item" v-if="order.distributionOrderUsers.length > 0">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>分销信息</span>
              </h3>
            </a-col>
          </a-row>
          <div>
            <a-row :gutter="48" class="saler" v-if="order.promoDistributor">
              <a-col :span="4">
                <div>
                  <div>{{ shareName }}员</div>
                  <div>
                    <b>{{ order.promoDistributor.nickname || '--' }}</b>
                  </div>
                </div>
              </a-col>
              <a-col :span="8" v-if="order.sellerInfo">
                <div>
                  <div>分销{{ title }}</div>
                  <div>
                    <b>{{ order.promoDistributor.meshName || '--' }}</b>
                  </div>
                </div>
              </a-col>
              <a-col :span="8">
                <div>
                  <div>此单获得佣金</div>
                  <div>
                    <b>{{ order.promoDistributor.realCommission || '--' }}</b>
                  </div>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="48" class="saler">
              <a-col :span="4">
                <div>{{ promoteName }}员</div>
                <div>
                  <b>{{ order.shareDistributor.nickname || '--' }}</b>
                </div>
              </a-col>
              <a-col :span="8">
                <div>此单获得{{ promoteName }}佣金</div>
                <div>
                  <b>{{ order.shareDistributor.realCommission || '--' }}</b>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="content__item" v-if="order.couponTitle">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>优惠信息</span>
              </h3>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <div>{{ order.couponTitle }} {{ order.couponPrice }}</div>
            </a-col>
          </a-row>
        </div>
        <div class="content__item" v-if="order.isOmsOrder">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>供货商信息</span>
              </h3>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <div>供货采购单号：{{ order.omsOrderNo || '--' }}</div>
            </a-col>
          </a-row>
        </div>
        <!-- <div class="content__item">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>卖家备注</span>
              </h3>
            </a-col>
          </a-row>
          <div>
            {{ order.messageSaler? order.messageSaler.filter(item => item !== '').join(", "):'--' }}
          </div>
        </div>-->
        <div class="content__item">
          <a-row>
            <a-col :span="24">
              <h3>
                <span>物流信息</span>
              </h3>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <span
              >发货信息：{{
                order.expressCompany ? order.expressCompany + ' ' + order.expressOrderNo : '暂无发货信息'
              }}</span
              >
            </a-col>
            <a-col :span="8" v-if="$route.query.entryType !== 'Order'">
              <span
              >退货信息：{{
                appeal.appealExpressCompany
                  ? appeal.appealExpressCompany + ' ' + appeal.appealExpressOrderNo
                  : '暂无发货信息'
              }}</span
              >
            </a-col>
          </a-row>
        </div>
        <div
          class="content__item"
          v-if="order.appeal && !order.isOmsOrder && !appeal.appealNo && $route.query.entryType !== 'Order'"
        >
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
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-modal v-model="refund.visible" title="退款" @ok="submitRefund" @cancel="cancelRefund">
      <a-form-model ref="refund" :model="refund" :rules="refund.rules">
        <a-form-model-item label="请输入退款金额" prop="amount">
          <a-input v-model="refund.amount" disabled>
            <a slot="suffix" @click="refund.amount = order.refundPrice">全部金额</a>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="refund.remark"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal v-model="rejectRefund.visible" title="拒绝" @ok="submitRejectRefund" @cancel="cancelRejectRefund">
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
  cancelOrder,
  ship,
  refund,
  refundRefuse,
  omsApply,
  ORDER_STATUS_PAID,
  EXPRESS_STATUS_UNSHIP,
  refundExpress,
  afterSale,
  ORDER_STATUS_WAITPAY,
  changeDelivery
} from '@/api/orders'
import area from '@/utils/area'
import { Cascader } from 'ant-design-vue'
// import { delete } from 'vuedraggable'

export default {
  components: {
    Cascader
  },
  data() {
    return {
      area,
      shareName: '分销',
      promoteName: '推广',
      fieldNames: {
        label: 'name',
        value: 'name',
        children: 'subs'
      },
      wuliuStatus: 'yes',
      kwaiOptions: [
        {
          name: '安能物流',
          value: 'annengwuliu'
        },
        {
          name: '百世快递',
          value: 'htky'
        },
        {
          name: '德邦快递',
          value: 'dbwl'
        },
        {
          name: '京东物流',
          value: 'jd'
        },
        {
          name: '顺丰速运',
          value: 'sf'
        },
        {
          name: '申通快递',
          value: 'st'
        },
        {
          name: '天天快递',
          value: 'tt'
        },
        {
          name: '圆通速递',
          value: 'yt'
        },
        {
          name: '韵达快递',
          value: 'yd'
        },
        {
          name: '邮政国内',
          value: 'yzgn'
        },
        {
          name: '邮政EMS速递',
          value: 'ems'
        },
        {
          name: '韵达快运',
          value: 'yundakuaiyun'
        },
        {
          name: '中通快递',
          value: 'zt'
        }
      ],
      appeal_reason: [
        [
          { reason: 0, name: '其他' },
          { reason: 1, name: '7天无理由退换货' },
          { reason: 2, name: '型号/功率/颜色等与商品页面描述不符' },
          { reason: 3, name: '功能/效果不符' },
          { reason: 4, name: '质量问题' },
          { reason: 5, name: '少件/漏发' },
          { reason: 6, name: '包装/商品破损' },
          { reason: 7, name: '假冒品牌' },
          { reason: 8, name: '未按约定时间发货' },
          { reason: 9, name: '发票问题' },
          { reason: 10, name: '商品漏发' },
          { reason: 11, name: '发错款号' },
          { reason: 12, name: '发错颜色' },
          { reason: 13, name: '发错尺码' }
        ],
        [
          { reason: 0, name: '其他' },
          { reason: 1, name: '多拍、错拍、不想要' },
          { reason: 2, name: '协商一致退款' },
          { reason: 3, name: '缺货' },
          { reason: 4, name: '发货慢' }
        ]
      ],
      cancelLoading: false,
      afterSaleList: [],
      appeal: {},
      title: '',
      omsApplyLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      previewVisible: false,
      previewImage: '',
      isHomaHo: false,
      order: {
        appeal: {},
        appeals: [],
        distributionOrderUsers: []
      },
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
          expressType: [{ required: true, message: '请选择快递类型', trigger: 'blur' }],
          expressOrderNo: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
          messageSaler: [{ required: true, message: '商家留言', trigger: 'blur' }]
        },
        visible: false,
        expressOrderNo: '',
        expressType: undefined, // a-select的bug 需设置为undefined，placeholder才会正常显示
        messageSaler: ''
      },
      express: {
        rules: {
          merchant_express_name: [{ required: true, message: '请输入收货人名字', trigger: 'blur' }],
          merchant_express_phone: [{ required: true, message: '请输入收货人号码', trigger: 'blur' }],
          merchant_express_address: [{ required: true, message: '请输入收货人地址', trigger: 'blur' }]
        },
        merchant_express_name: '',
        merchant_express_phone: '',
        merchant_express_address: '',
        visible: false
      },
      address: {
        rules: {
          expressName: [{ required: true, message: '请输入收件人命名', trigger: 'blur' }],
          expressPhone: [{ required: true, message: '请输入收货人手机号', trigger: 'blur' }],
          expressArea: [{ required: true, message: '请选择地区', trigger: 'change' }],
          expressAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
        },
        expressName: '',
        expressArea: [],
        expressPhone: '',
        expressAddress: '',
        visible: false
      },
      columns: [
        {
          title: '商品信息',
          width: 400,
          customRender: (text, row, index) => {
            if (!row.orderGoods) {
              return
            }
            return {
              children: (
                <div>
                  {row.orderGoods.map(goods => (
                    <div class="row product">
                      <div>
                        <img class="img-style" src={goods.listPicUrl} />
                      </div>
                      <div>
                        <p class="product__info">{goods.goodsName}</p>
                      </div>
                      <div class="product_tag">
                      {row.isOmsOrder ? <a-tag color="orange">供销商品</a-tag> : ''}
                        {row.isAppeal ? <a-tag color="orange">{row.appealStatusName}</a-tag> : <span class=""></span>}
                        {row.isSelfBuy ? <a-tag color="green">掌柜自购</a-tag> : ''}
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
                      <p>{goods.specification.map(it => it.value).join('/') || '--'}</p>
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
          title: '商品成本价',
          customRender: (text, row, index) => {
            return `￥${row.settlementPrice}`
          }
        },
        {
          title: '数量',
          dataIndex: 'number'
        },
        {
          title: '运费',
          customRender: (text, row, index) => {
            return `￥${row.expressPrice}`
          }
        },
        {
          title: '商品总价',
          customRender: (text, row, index) => {
            return `￥${row.totalPrice}`
          }
        },
        {
          title: '实付金额',
          customRender: (text, row, index) => {
            return `￥${row.payPrice}`
          }
        },
        {
          title: '优惠',
          customRender: (text, row, index) => {
            return row.couponTitle ? `${row.couponTitle}` : '无'
          }
        },
        {
          title: '来源',
          customRender: (text, row, index) => {
            return row.salerMesh.name
          }
        },
        {
          title: '商家实收金额',
          width: 200,
          fixed: 'right',
          customRender: (text, row, index) => {
            return (
              <div>
                ¥{row.realIncome}
                {row.status === 'pay_timeout' ? (
                  ''
                ) : row.status === 'cancel' ? (
                  ''
                ) : (
                  <a-popover placement="right">
                    <template slot="content">
                      <p>售价： ¥{row.totalPrice}</p>
                      <p>运费： ¥{row.expressPrice}</p>
                      {row.isOmsOrder ? <p>成本价： ¥{row.settlementPrice}</p> : ''}
                      <p>
                        {row.isSelfBuy ? '自购优惠' : '分销奖励'}：¥{row[row.isSelfBuy ? 'totalSelfBuyDiscountPrice' : 'totalCommission']}
                      </p>
                      <p>优惠：¥{row.couponPrice}</p>
                      <p>平台手续费：¥({row.serviceFee})(含微信支付手续费)</p>
                    </template>
                    <a-icon class="tips-icon" type="info-circle" />
                  </a-popover>
                )}
              </div>
            )
          }
        }
      ],
      rejectRefund: {
        rules: {
          remark: [{ required: true, message: '拒绝退款备注', trigger: 'blur' }]
        },
        visible: false,
        remark: ''
      }
    }
  },
  computed: {
    omsApplyStatus() {
      return (
        this.order.isAppeal &&
        this.order.isOmsOrder &&
        this.appeal.omsStatus !== 'oms_create' &&
        this.$route.query.entryType !== 'Order'
      )
    },
    appealTypeStatus() {
      return (
        (this.appeal.status === 'undeal' || this.appeal.status === 'accept') &&
        this.order.isAppeal &&
        this.appeal.appealType === 0 &&
        this.$route.query.entryType !== 'Order'
      )
    },
    shipable() {
      return (
        this.order.status === ORDER_STATUS_PAID &&
        this.order.expressStatus === EXPRESS_STATUS_UNSHIP &&
        !this.order.isOmsOrder &&
        this.$route.query.entryType === 'Order'
      )
    },
    canceLOrderStatus() {
      return (
        ((this.order.status === ORDER_STATUS_PAID && !this.order.isOmsOrder) ||
          this.order.status === ORDER_STATUS_WAITPAY) &&
        this.order.expressStatus === EXPRESS_STATUS_UNSHIP &&
        !this.order.isAppeal &&
        this.$route.query.entryType === 'Order'
      )
    },
    refundable() {
      return (
        (this.order.isAppeal &&
          (this.appeal.status === 'undeal' || this.appeal.status === 'accept') &&
          this.$route.query.entryType !== 'Order' &&
          this.appeal.appealType === 1) ||
        (this.order.isAppeal &&
          this.appeal.status === 'wait_express' &&
          this.appeal.appealType === 0 &&
          this.$route.query.entryType !== 'Order') ||
        (this.order.isAppeal &&
          this.appeal.status === 'expressed' &&
          this.appeal.appealType === 0 &&
          this.$route.query.entryType !== 'Order')
      )
    },
    copyValue() {
      return `收货人: ${this.order.expressName}\n电话: ${this.order.expressPhone}\n地址: ${this.order.expressAddress}`
    },
    changeAddressStatus() {
      return (
        !this.order.isOmsOrder &&
        (this.order.status === ORDER_STATUS_PAID || this.order.status === ORDER_STATUS_WAITPAY) &&
        this.$route.query.entryType === 'Order' &&
        this.order.expressStatus !== 1
      )
    }
  },
  filters: {
    saleStatus(val) {
      switch (val) {
        case -1:
          return '拒绝'
        case 0:
          return '审核中'
        case 1:
          return '待上传快递单'
        case 2:
          return '退款完成'
        case 3:
          return '已取消'
        default:
          return ''
      }
    },
    appealReason(val) {
      switch (val) {
        case 0:
          return '其他'
        case 1:
          return '多拍、错拍、不想要'
        case 2:
          return '协商一致退款'
        case 3:
          return '缺货'
        case 4:
          return '发货慢'
        case 5:
          return '7天无理由退换货'
        case 6:
          return '型号/功率/颜色等与商品页面描述不符'
        case 7:
          return '功能/效果不符'
        case 8:
          return '质量问题'
        case 9:
          return '少件/漏发'
        case 10:
          return '包装/商品破损'
        case 11:
          return '假冒品牌'
        case 12:
          return '未按约定时间发货'
        case 13:
          return '发票问题'
        case 14:
          return '商品漏发'
        case 15:
          return '发错款号'
        case 16:
          return '发错颜色'
        case 17:
          return '发错尺码'
        default:
          return '--'
      }
    }
  },
  methods: {
    clipboardSuccessHandler() {
      this.$message.success('复制成功')
    },
    clipboardErrorHandler() {
      this.$message.warning('复制失败')
    },
    onChangeArea(val, selectedOptions) {
      if (val.length) {
        this.address.expressArea = val
        this.address.expressProvince = val[0] || ''
        this.address.expressCity = val[1] || ''
        this.address.expressRegion = val[2] || ''
        this.address.expressAreaCode = selectedOptions[2].code || ''
      }
    },
    changeAddress() {
      this.address.visible = true
    },
    async cancelOrder() {
      try {
        this.cancelLoading = true
        const { meta } = await cancelOrder(this.$route.params.id)
        if (meta.code === 0) {
          this.$message.success('操作成功')
        }
        this.fetchOrder()
      } catch (e) {
        this.$message.error('操作失败')
      } finally {
        this.cancelLoading = false
      }
    },
    cancelOrderOperate() {
      this.$message.error('已取消')
    },
    async afterSale() {
      const { data } = await afterSale({
        outOrderNo: this.$route.params.id
      })
      if (data) {
        this.afterSaleList = data || []
      }
    },
    operateApply() {
      this.express.merchant_express_address = this.appeal.merchantExpressAddress || ''
      this.express.merchant_express_name = this.appeal.merchantExpressName || ''
      this.express.merchant_express_phone = this.appeal.merchantExpressPhone || ''
      this.express.visible = true
    },
    aoply(status) {
      getOrder({
        id: this.$route.params.id
      }).then(res => {
        if (res.meta.code === 0) {
          this.detailData = res.data
        }
      })
    },
    async fetchOrder() {
      const { data } = await getOrder(this.$route.params.id)
      this.order = data
      this.appeal = data.appeal || {}

      if (data.isAppeal) data.appealStatusName = this.filterAppealStatus(data)
      this.data = [data]
      if (data.appeals) {
        data.appeals.forEach(v => {
          v.statusName = this.filterStatus(v.status)
        })
      }
      if (this.order.expressName !== '') {
        this.address.expressName = this.order.expressName
        this.address.expressPhone = this.order.expressPhone
      }
      if (this.order.isOmsOrder) {
        this.afterSale()
      }
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
    filterAppealStatus(item) {
      let statusName
      if (
        item.appeal.status === 'undeal' ||
        item.appeal.status === 'accept' ||
        item.appeal.status === 'expressed' ||
        item.appeal.status === 'wait_express'
      ) {
        statusName = '退款中'
      }
      if (item.appeal.status === 'refund') statusName = '退款完成'
      return statusName
    },
    filterStatus(val) {
      let vals = ''
      switch (val) {
        case 'pay_timeout':
          vals = '已取消'
          break
        case 'complete':
          vals = '已完成'
          break
        case 'cancel':
          vals = '已取消'
          break
        case 'refund':
          vals = '已退款'
          break
        case 'refund_refuse':
          vals = '拒绝退款'
          break
        case 'appealing':
          vals = '待处理'
          break
        default:
          return '--'
      }
      return vals
    },
    handlePreview(file) {
      this.previewImage = file
      this.previewVisible = true
    },
    handleCancel() {
      this.previewVisible = false
    },
    closeRefundModel() {
      this.refund.visible = false
      this.cancelRefund()
    },
    cancelRefund() {
      this.$refs.refund.resetFields()
    },
    cancel(e) {
      this.$message.error('已取消')
    },
    // 修改地址
    cancelChangeAddress() {
      this.address.visible = false
    },
    async submitChangeAddress() {
      await this.$refs.address.validate()
      try {
        await changeDelivery(this.order.orderNo, {
          expressName: this.address.expressName,
          expressPhone: this.address.expressPhone,
          expressProvince: this.address.expressProvince,
          expressCity: this.address.expressCity,
          expressRegion: this.address.expressRegion,
          expressAreaCode: this.address.expressAreaCode,
          expressAddress: this.address.expressAddress
        })
        this.$message.success('操作成功')
        this.fetchOrder()
        this.cancelChangeAddress()
      } catch (e) {
        this.$message.error('操作失败')
      }
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
    async submitRefundExpress() {
      await this.$refs.express.validate()
      try {
        const param = Object.assign({}, this.express)
        delete param.rules
        delete param.visible
        const { meta } = await refundExpress(this.order.orderNo, param)
        if (meta.code === 0) {
          this.$message.success('操作成功')
          this.fetchOrder()
          this.cancelExpress()
        } else {
          this.$message.error(meta.message)
        }
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    cancelExpress() {
      this.express.visible = false
      this.$refs.express.resetFields()
    },
    async submitOmsApply() {
      try {
        this.omsApplyLoading = true
        const { meta } = await omsApply(this.order.orderNo)
        if (meta.code === 0) {
          this.$message.success('操作成功')
          this.fetchOrder()
        } else {
          this.$message.error(meta.message)
        }
      } catch (e) {
        this.$message.error('操作失败')
      } finally {
        this.omsApplyLoading = false
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
      let options = {}
      if (this.wuliuStatus === 'yes') {
        await this.$refs.ship.validate()
        options = this.ship
      }
      try {
        await ship(this.order.orderNo, options)
        this.$message.success('发货成功')
        this.fetchOrder()
        this.cancelShip()
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    cancelShip() {
      this.ship.visible = false
    }
  },
  mounted() {
    this.fetchOrder()
  },
  created() {
    this.title = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '云铺' : '格子铺'
    this.shareName = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '销售' : '分销'
    this.promoteName = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '分销' : '推广'
    this.isHomaHo = process.env.VUE_APP_PROJECT_TYPE === 'HOMAHO'
  }
}
</script>
<style lang="less">
.ant-form-item-label {
  text-align: left;
}
</style>
<style lang="less" scoped>
@import './style.less';
.img-style {
  width: 50px;
  height: 50px;
}
.img_list {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  .item {
    width: 100px;
    margin: 0 20px 20px;
  }
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
.mb_20 {
  margin-bottom: 20px;
}
.tac {
  text-align: center;
}
.btn-style {
  margin-left: 20px;
}
</style>
