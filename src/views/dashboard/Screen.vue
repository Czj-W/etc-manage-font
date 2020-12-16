<template>
  <div class="container" style="height: 100%">
    <div class="col col--side">
      <div class="wrapper col__left">
        <div class="title">
          <span class="title-box">实时付款金额(万元)</span>
        </div>
        <div class="flex-1 relative chart">
          <div class="box box-top-left"></div>
          <div class="box box-top-right"></div>
          <div class="box box-bottom-left"></div>
          <div class="box box-bottom-right"></div>
          <div id="salesTrend" />
        </div>
      </div>
      <div class="wrapper col__left">
        <div class="title">
          <span class="title-box">实时新增用户</span>
        </div>
        <div class="flex-1 chart">
          <div class="box box-top-left"></div>
          <div class="box box-top-right"></div>
          <div class="box box-bottom-left"></div>
          <div class="box box-bottom-right"></div>
          <div id="userGrowthTrend" />
        </div>
      </div>
      <div class="wrapper col__left">
        <div class="title">
          <span class="title-box">最新订单</span>
        </div>
        <div class="flex-1 relative" id="order-container">
          <div class="box box-top-left"></div>
          <div class="box box-top-right"></div>
          <div class="box box-bottom-left"></div>
          <div class="box box-bottom-right"></div>
          <div class="orders overflow-y" ref="orders">
            <div class="first-order">
              <div class="order" v-for="(order, index) in orders" :key="index">
                <div class="order--avatar">
                  <img :src="order.image" />
                </div>
                <div class="order--name">{{ order.title }}</div>
                <div class="order--createdtime">{{ order.createdTime }}</div>
                <div class="order--ordermoney">￥{{ formatMoney(order.value) }}</div>
              </div>
            </div>
            <div>
              <div class="order" v-for="(order, index) in orders" :key="index">
                <div class="order--avatar">
                  <img :src="order.image" />
                </div>
                <div class="order--name">{{ order.title }}</div>
                <div class="order--createdtime">{{ order.createdTime }}</div>
                <div class="order--ordermoney">￥{{ formatMoney(order.value) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col col--center">
      <div class="title text-center">实时销售总额</div>
      <div>
        <Amount :amount="amount"></Amount>
      </div>
      <div class="flex-1" style="margin-bottom: 0">
        <amap :data="mapData"></amap>
      </div>
    </div>
    <div class="col col--side">
      <div class="wrapper flex-1">
        <div class="title">分销商排名</div>
        <div class="flex-1">
          <div class="box box-top-left"></div>
          <div class="box box-top-right"></div>
          <div class="box box-bottom-left"></div>
          <div class="box box-bottom-right"></div>
          <sale-rank :data="saleMans"></sale-rank>
        </div>
      </div>
      <div class="flex-1 wrapper">
        <div class="flex-1">
          <div class="box box-top-left"></div>
          <div class="box box-top-right"></div>
          <div class="box box-bottom-left"></div>
          <div class="box box-bottom-right"></div>
          <bubble :data="bubbleData"></bubble>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import Bignumber from 'bignumber.js'
import SaleRank from '@/components/Screen/Rank'
import Bubble from '@/components/Screen/Bubble'
import Map from '@/components/Screen/Map'
import { getStats } from '@/api/stats'
import moment from 'moment'
import Amount from '@/components/Screen/Amount'

const defaultAvatar = '/avatar2.jpg'

export default {
  components: {
    'sale-rank': SaleRank,
    bubble: Bubble,
    amap: Map,
    Amount
  },
  data() {
    return {
      amount: 0,
      max: 1,
      dailyNewMemberCounts: [],
      dailySales: [],
      saleMans: [],
      orders: [],
      bubbleData: [
        { name: '四川', value: 260 },
        { name: '广州', value: 400 },
        { name: '甘肃', value: 300 },
        { name: '云南', value: 240 },
        { name: '山东', value: 350 },
        { name: '上海', value: 280 }
      ],
      mapData: [
        { name: '四川', value: 3000 },
        { name: '甘肃', value: 4000 },
        { name: '广东', value: 5000 }
      ]
    }
  },
  methods: {
    renderChart(data, id, config = null) {
      const chart = new Chart({
        container: id,
        autoFit: true,
        padding: [20, 20, 40, 40]
      })

      chart.data(data)
      chart.scale({
        year: {
          range: [0, 1]
        }
      })
      const values = new Set(data.map(it => it.value))
      chart.scale('value', {
        min: 0,
        minTickInterval: 1,
        tickCount: values.size,
        nice: true
      })

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      chart
        .line()
        .position('year*value')
        .label('value', {
          layout: {
            type: 'fixed-overlap'
          },
          style: {
            fill: '#fff'
          }
        })
      chart.animate('wave-in')

      chart.point().position('year*value')
      chart.scale('year', {
        type: 'cat'
      })

      if (config && config.xaxis) {
        chart.axis('year', config.xaxis)
      }
      if (config && config.yaxis) {
        chart.axis('value', config.yaxis)
      }
      if (config && config.scale) {
        chart.scale('value', config.scale)
        chart.axis('value', {
          title: {
            style: {
              fill: '#fff'
            }
          }
        })
      }
      if (config && config.area) {
        chart
          .area()
          .position('year*value')
          .color('l(90) 0:#3c6984 0.5:#125b86 1:#2ea0cc')
      }

      chart.render()

      return chart
    },
    renderSoldAmount() {
      // 销售金额折线图
      const data = this.dailySales.map(it => ({
        year: moment(it.date).format('MM-DD'),
        value: parseFloat((parseFloat(it.totalPrice) / 10000).toFixed(2))
      }))
      if (!this.dailySaleChart) {
        this.dailySaleChart = this.renderChart(data, 'salesTrend', {
          xaxis: {
            grid: null,
            label: {
              rotate: -45
            }
          },
          area: true
        })
      } else {
        this.dailySaleChart.changeData(data)
      }
    },
    renderUserGrowthTrend() {
      // 用户趋势折线图
      const data = this.dailyNewMemberCounts.map(it => ({
        year: moment(it.date).format('MM-DD'),
        value: parseInt(it.memberCount)
      }))
      if (!this.dailyUserGrowthChart) {
        this.dailyUserGrowthChart = this.renderChart(data, 'userGrowthTrend', {
          xaxis: {
            grid: null,
            label: {
              rotate: -45
            }
          }
        })
      } else {
        this.dailyUserGrowthChart.changeData(data)
      }
    },
    formatMoney(value) {
      return new Bignumber(value).toFormat()
    },
    async fetchStats() {
      const { data } = await getStats()
      const { dailyNewMemberCounts, dailySales, totalSales: amount, topLeagueSales, recentOrders } = data[0]

      this.dailyNewMemberCounts = dailyNewMemberCounts
      this.dailySales = dailySales
      this.amount = parseInt(amount)

      // TODO:// setInterval 是测试代码，正式需要将其删除
      // setInterval(() => {
      //   this.amount += 2345
      // }, 2000)

      // 计算分销商
      this.saleMans = topLeagueSales.map(it => {
        return {
          image: it.mesh.avatarUrl || defaultAvatar,
          title: it.mesh.name,
          value: parseFloat(it.totalPrice)
        }
      })
      // 计算最新订单
      this.orders = recentOrders.map(it => ({
        image: it.buyer.avatarUrl || defaultAvatar,
        title: it.buyer.nickname,
        value: it.totalPrice,
        createdTime: moment(it.createdAt).format('HH:mm')
      }))

      this.renderSoldAmount()
      this.renderUserGrowthTrend()
    },
    startTimer() {
      this.intervalID = setInterval(() => this.fetchStats(), 1000)
    },
    stopTimer() {
      clearInterval(this.intervalID)
    },
    startOrderRun(e) {
      this.orderRunIntervalValue = setInterval(() => {
        if (this.$refs.orders) {
          const firstNodeHeight = document.querySelectorAll('.first-order')[0].clientHeight
          const scrollTop = this.$refs.orders.scrollTop
          if (scrollTop === firstNodeHeight) {
            this.$refs.orders.scrollTo({ top: 0 })
          } else {
            this.$refs.orders.scrollTo({ top: scrollTop + 1 })
          }
        }
      }, 30)
    },
    stopOrderRun() {
      clearInterval(this.orderRunIntervalValue)
    }
  },
  mounted() {
    this.fetchStats()
    // this.startTimer()
    this.startOrderRun()
  },
  beforeDestroy() {
    this.stopTimer()
    this.stopOrderRun()
  }
}
</script>
<style lang="less" scoped>
@border-color: #56d3d3;

::-webkit-scrollbar {
  display: none;
}

html,
body {
  overflow: hidden;
  margin: 0;
}
.container {
  padding: 30px;
  width: 100%;
  height: 100vh;
  background: #000414;
  display: flex;
  color: white;
  overflow: hidden;
  position: relative;
}
.col {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}
.col--side {
  width: 30%;
}
.col--center {
  width: 40%;
}
.flex-1 {
  flex: 1;
}
.title {
  font-size: 18px;
  color: #528cd5;
  font-weight: 600;
  word-spacing: 10px;
}
.col > div:not(:first-child) {
  margin-top: 10px;
}
#amount {
  color: white;
  font-size: 50px;
  text-align: center;
  height: 30%;
}
.col__left {
  height: calc((100% - 30px) / 3);
}
.wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 20px;
}
.wrapper > div:last-child {
  width: 100%;
  height: calc(100% - 40px);
  position: relative;
  border-radius: 5px;
  border: 1px solid #12414f;
  padding: 20px;
}
.order {
  width: 100%;
  height: 30px !important;
  display: flex;
  flex: 1;
  justify-content: space-between;
  overflow: hidden;
  align-items: center;
}
.order:nth-child(odd) {
  background: #1a3f76;
}
.order:not(:first-child) {
  margin-top: 5px;
}
.orders {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  overflow: hidden;
}
.order > div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.orders > .top-user:not(:first-child) {
  margin-top: 10px;
}
.order > div:not(:first-child) {
  margin-left: 10px;
}
.order--avatar > img {
  height: 30px;
}
.text-center {
  text-align: center;
}
#salesTrend,
#userGrowthTrend,
.orders {
  background: #2f475e4d;
  width: 100%;
  height: 100%;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-y {
  overflow-y: auto;
}
.relative {
  position: relative;
}
.box {
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 99;
  border: 2px solid transparent;
}
.box-top-left {
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-color: @border-color;
  border-left-color: @border-color;
}
.box-top-right {
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-color: @border-color;
  border-right-color: @border-color;
}
.box-bottom-left {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-color: @border-color;
  border-left-color: @border-color;
}
.box-bottom-right {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-color: @border-color;
  border-right-color: @border-color;
}
</style>
