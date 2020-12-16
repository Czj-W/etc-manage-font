<template>
  <a-card>
    <a-row :gutter="48">
      <a-col :span="24" class="statistics-manger">
        <h3>财务管理</h3>
        <div class="card-info">
          企业收款账户：
          <a class="withdrawal" @click="handleBank('create')" v-if="!isBankSuccess">点击绑定银行卡</a>
          <span v-if="isBankSuccess">{{ bankInfo.company }}</span>
          <a class="withdrawal" @click="isShowBankInfo = true" v-if="isBankSuccess">查看</a>
          <a class="withdrawal" @click="handleBank('update')" v-if="isBankSuccess">申请修改</a>
        </div>
      </a-col>
      <a-col :span="16" class="statistics">
        <div class="statistic">
          <a-card>
            <a-statistic :value="formatMoney(balance)">
              <template slot="title">
                <div class="statistic__title">
                  <span>账户余额</span>
                  <a-popover placement="right">
                    <template slot="content">
                      <span>账户余额 = 可提现 + 待入账</span>
                    </template>
                    <a-icon class="tips" type="info-circle" />
                  </a-popover>
                </div>
              </template>
            </a-statistic>
          </a-card>
        </div>
        <div class="statistic">
          <a-card>
            <a-statistic :value="formatMoney(withdrawableBalance)">
              <template slot="title">
                <div class="statistic__title">
                  <span>可提现金额</span>
                  <a-popover placement="right">
                    <template slot="content">
                      <span>可以直接提现金额</span>
                    </template>
                    <a-icon class="tips" type="info-circle" />
                  </a-popover>
                </div>
              </template>
              <template slot="suffix">
                <a class="withdrawal" @click="showMenoy">提现</a>
              </template>
            </a-statistic>
          </a-card>
        </div>
        <div class="statistic">
          <a-card>
            <a-statistic :value="formatMoney(uncollectionWallet)">
              <template slot="title">
                <div class="statistic__title">
                  <span>待入账</span>
                  <a-popover placement="right">
                    <template slot="content">
                      <span>待订单完成交易入账</span>
                    </template>
                    <a-icon class="tips" type="info-circle" />
                  </a-popover>
                </div>
              </template>
              <template slot="suffix">
                <router-link to="/finance/pending" class="withdrawal">查看</router-link>
              </template>
            </a-statistic>
          </a-card>
        </div>
        <div class="statistic">
          <a-card>
            <a-statistic :value="formatMoney(todayIncome)">
              <template slot="title">
                <div class="statistic__title">
                  <span>今日收益</span>
                  <a-popover placement="right">
                    <template slot="content">
                      <span>今日目前为止订单完成交易入账金额</span>
                    </template>
                    <a-icon class="tips" type="info-circle" />
                  </a-popover>
                </div>
              </template>
            </a-statistic>
          </a-card>
        </div>
      </a-col>
    </a-row>
    <a-row class="trades">
      <a-col :span="24">
        <h3>交易明细</h3>
        <a-table :data-source="rows" :columns="columns" :pagination="pagination" @change="onPageChage"></a-table>
      </a-col>
    </a-row>
    <a-modal
      title="提现"
      :visible="withdrawal.visible"
      @ok="submitWithdrawal"
      okText="提交申请"
      @cancel="cancelWithdrawal"
    >
      <a-form-model ref="withdrawal" :model="withdrawal" :rules="withdrawal.rules">
        <a-form-model-item label="提现金额（提现到微信零钱）" prop="amount">
          <a-input v-model="withdrawal.amount" />
        </a-form-model-item>
      </a-form-model>
      <a-row class="withdrawal__tips">
        <a-col :span="24">
          <div>
            <span>可提现余额: {{ formatMoney(withdrawableBalance) }}元</span>
            <a @click="withdrawal.amount = withdrawableBalance" class="withdrawal__btn--all">全部提现</a>
          </div>
          <div>最低提现金额 1 元</div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" class="content-part">
          <h4>温馨提示</h4>
          <ul>
            <li>提现申请发起后 3 个工作日内到账</li>
            <li>
              如需要协助，请联系
              <a href>{{ title }}客服</a>
            </li>
          </ul>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 绑定银行卡弹窗 -->
    <a-modal title="企业收款账户信息" :visible="bank.isShowBank" @ok="submitBank" okText="提交" @cancel="cancelBank">
      <a-form-model ref="bank" :model="bank" :rules="bank.rules">
        <a-form-model-item label="账户名称" prop="company">
          <a-input v-model="bank.company" />
        </a-form-model-item>
        <a-form-model-item label="银行账户" prop="bank_account">
          <a-input v-model="bank.bank_account" />
        </a-form-model-item>
        <a-form-model-item label="开户银行" prop="bank_name">
          <a-input v-model="bank.bank_name" />
        </a-form-model-item>
        <a-form-model-item label="开户支行" prop="bank_subname">
          <a-input v-model="bank.bank_subname" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 绑定银行卡弹窗 -->
    <!-- 查看绑定信息 -->
    <a-modal
      title="企业收款账户信息"
      :visible="isShowBankInfo"
      @ok="submitBankInfo"
      okText="确定"
      @cancel="cancelBankInfo"
    >
      <a-row>
        <a-col :span="24" class="content-part">
          <div>账户名称：{{ bankInfo.company }}</div>
          <div>银行账户：{{ bankInfo.bankAccount }}</div>
          <div>开户银行：{{ bankInfo.bankName }}</div>
          <div>开户支行：{{ bankInfo.bankSubname || '' }}</div>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 查看绑定信息 -->
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import { Statistic } from 'ant-design-vue'
import Bignumber from 'bignumber.js'
import { getWalletRecords, getWalletApply } from '@/api/wallet_records'
import ordersApi from '@/api/orders'

export default {
  components: {
    'a-statistic': Statistic
  },
  data() {
    return {
      title: '',
      rows: [],
      balance: 0,
      withdrawableBalance: 0,
      uncollectionWallet: 0,
      todayIncome: 0,
      isBankSuccess: true,
      isShowBankInfo: false,
      bankInfo: '',
      page: 1,
      type: 'create',
      pagination: {},
      withdrawal: {
        visible: false,
        amount: '',
        rules: {
          amount: [
            { required: true, message: '请填写提现金额', trigger: 'blur' },
            {
              validator: (rule, value, cb) => {
                let message = ''
                if (!/^\d+((\.\d{1,2})?)$/.test(value)) {
                  message = '金额错误'
                  cb(message)
                  return
                }
                if (parseFloat(value) < 1) {
                  message = '最低提现金额 1 元'
                  cb(message)
                  return
                }
                cb()
              }
            }
          ]
        }
      },
      bank: {
        isShowBank: false,
        company: '',
        bank_account: '',
        bank_name: '',
        bank_subname: '',
        rules: {
          company: [{ required: true, message: '请填写账户名称', trigger: 'blur' }],
          bank_account: [{ required: true, message: '请填写银行账户', trigger: 'blur' }],
          bank_name: [{ required: true, message: '请填写开户银行', trigger: 'blur' }],
          bank_subname: [{ required: true, message: '请填写开户支行', trigger: 'blur' }]
        }
      },
      columns: [
        {
          title: '时间',
          dataIndex: 'createdAt'
        },
        {
          title: '商户订单号',
          // dataIndex: 'recordSn'
          customRender: (text, row, index) => {
            return (
              <div>
                <router-link to={`/orders/${row.recordSn}?entryType=Order`}>{row.recordSn}</router-link>
              </div>
            )
          }
        },
        {
          title: '账务类型',
          dataIndex: 'remark'
        },
        {
          title: '收支金额',
          dataIndex: 'money'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      name: state => state.user.name
    }),
    queryParam() {
      return {
        page: this.page
      }
    }
  },
  watch: {
    queryParam() {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const {
          data: { list, meta, stats, page }
        } = await getWalletRecords(this.queryParam)
        this.rows = list
        this.meta = meta
        this.withdrawableBalance = stats.balance
        this.balance = Bignumber(stats.balance).plus(stats.uncollectionWallet)
        this.uncollectionWallet = stats.uncollectionWallet
        this.todayIncome = stats.todayIncome
        this.pagination = {
          pageSize: page.pageSize,
          total: page.total
        }
      } finally {
        this.loading = false
      }
    },
    async getBankInfoPage() {
      try {
        const { meta, data } = await ordersApi.getBankInfo()
        if (meta.code === 0) {
          if (data.company) {
            this.bankInfo = data
            this.bank.company = data.company
            this.bank.bank_account = data.bankAccount
            this.bank.bank_name = data.bankName
            this.bank.bank_subname = data.bankSubname
            this.isBankSuccess = true
          } else {
            this.isBankSuccess = false
          }
        }
      } finally {
      }
    },
    async submitWithdrawal() {
      await this.$refs.withdrawal.validate()
      try {
        const { meta } = await getWalletApply({
          money: this.withdrawal.amount,
          receipter_name: this.bankInfo.company
        })
        if (meta.code === 0) {
          this.$message.success('申请成功')
          this.withdrawal.amount = ''
          this.withdrawal.visible = false
        } else {
          this.$message.error(meta.message)
        }
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async submitBank() {
      await this.$refs.bank.validate()
      try {
        const { meta, data } = await ordersApi[this.type === 'create' ? 'setBankInfo' : 'updateBankInfo']({
          company: this.bank.company,
          bank_account: this.bank.bank_account,
          bank_name: this.bank.bank_name,
          bank_subname: this.bank.bank_subname,
          id: this.bankInfo.id
        })
        if (meta.code === 0) {
          this.$message.success(this.type === 'create' ? '绑定成功' : '修改成功')
          this.bankInfo = data
          // this.bank.company = this.bank.bank_account = this.bank.bank_name = this.bank.bank_subname = ''
          this.getBankInfoPage()
          this.bank.isShowBank = false
          // this.isBankSuccess = true
        } else {
          this.$message.error(meta.message)
        }
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    showMenoy() {
      if (this.isBankSuccess) {
        this.withdrawal.visible = true
      } else {
        this.$message.warning('请先绑定收款银行卡！')
      }
    },
    handleBank(type) {
      this.type = type
      this.bank.isShowBank = true
    },
    submitBankInfo() {
      this.isShowBankInfo = false
    },
    cancelBankInfo() {
      this.isShowBankInfo = false
    },
    cancelBank() {
      this.bank.isShowBank = false
      this.$refs.bank.resetFields()
    },
    cancelWithdrawal() {
      this.withdrawal.visible = false
      this.$refs.withdrawal.resetFields()
    },
    formatMoney(value) {
      return new Bignumber(value).toFormat()
    },
    onPageChage(pagination) {
      this.page = pagination.current
    }
  },
  mounted() {
    this.fetchData()
    this.getBankInfoPage()
  },
  created() {
    this.title = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '云批' : '格子圈'
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/dist/antd.less';

.statistics,
.statistic__title,
.statistics-manger {
  display: flex;
}
.statistics-manger {
  .card-info {
    margin-left: 30px;
  }
}
.statistic {
  flex: 1;
}
.statistic__title {
  justify-content: space-between;
}
.statistic:not(:first-child) {
  margin-left: 20px;
}
.withdrawal {
  margin-left: 10px;
}
.tips {
  cursor: pointer;
}
.trades,
.content-part {
  margin-top: 20px;
}
.withdrawal__tips {
  background: #ececec;
  padding: 10px;
}
.withdrawal__btn--all {
  margin-left: 5px;
}
</style>
