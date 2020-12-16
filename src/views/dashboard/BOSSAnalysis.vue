<template>
  <div class="page-header-index-wide" style="height: 100%">
    <a-row style="height: 100%;">
      <a-col :sm="7" style="height: 100%;">
        <div id="salesTrend" />
        <div id="userGrowthTrend" />
        <div>
          订单滚动
        </div>
      </a-col>
      <a-col :sm="10" style="height: 100%;">
        <div style="height: 30%;">
          总销售额数字
        </div>
        <div style="height: 70%;">
          <div id="map"></div>
        </div>
      </a-col>
      <a-col :sm="7" style="height: 100%;">
        <div style="height: 50%;">
          排名
        </div>
        <div style="height: 50%;">
          气泡图
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'

import { Scene } from '@antv/l7'
import { CountryLayer } from '@antv/l7-district'

import { Mapbox } from '@antv/l7-maps'

const ProvinceData = [
  {
    name: '广东省',
    code: 440000,
    value: 97277.77
  },

  {
    name: '福建省',
    code: 350000,
    value: 35804.04
  },
  {
    name: '湖北省',
    code: 420000,
    value: 39366.55
  },
  {
    name: '西藏自治区',
    code: 540000,
    value: 1477.63
  }
]
export default {
  data() {
    return {}
  },
  methods: {
    renderUserGrowthTrend() {
      // 折线图
      const data = [
        { year: '5.27', value: 9999 },
        { year: '5-28', value: 12000 },
        { year: '5-29', value: 14000 },
        { year: '5-30', value: 15000 },
        { year: '5-31', value: 17000 },
        { year: '6-1', value: 18000 },
        { year: '6-2', value: 20000 },
        { year: '6-3', value: 23000 },
        { year: '6-4', value: 24000 }
      ]
      const chart = new Chart({
        container: 'salesTrend',
        autoFit: true,
        height: 300
      })

      chart.data(data)
      chart.scale({
        year: {
          range: [0, 1]
        },
        value: {
          min: 0,
          nice: true
        }
      })

      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true
      })

      chart
        .line()
        .position('year*value')
        .label('value')
      chart.point().position('year*value')

      chart.render()
    },
    renderSoldAmount() {
      // 折线图
      const data = [
        { year: '5.27', value: 100 },
        { year: '5-28', value: 120 },
        { year: '5-29', value: 140 },
        { year: '5-30', value: 100 },
        { year: '5-31', value: 100 },
        { year: '6-1', value: 180 },
        { year: '6-2', value: 200 },
        { year: '6-3', value: 230 },
        { year: '6-4', value: 240 }
      ]
      const chart = new Chart({
        container: 'salesTrend',
        autoFit: true,
        height: 300
      })

      chart.data(data)
      chart.scale({
        year: {
          range: [0, 1]
        },
        value: {
          min: 0,
          nice: true
        }
      })

      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true
      })

      chart
        .line()
        .position('year*value')
        .label('value')
      chart.point().position('year*value')

      chart.render()
    },
    renderMap() {
      // 地图
      const scene = new Scene({
        id: 'map',
        map: new Mapbox({
          center: [116.2825, 39.9],
          pitch: 0,
          style: 'dark',
          zoom: 3,
          minZoom: 0,
          maxZoom: 10
        })
      })
      scene.on('loaded', () => {
        return new CountryLayer(scene, {
          data: ProvinceData,
          joinBy: ['NAME_CHN', 'name'],
          depth: 1,
          fill: {
            // color: '#ccc'
          },
          bubble: {
            enable: true,
            size: {
              field: 'value',
              values: [3, 20]
            }
          },
          popup: {
            enable: true,
            Html: props => {
              return `<span>${props.NAME_CHN}:</span><span>${props.value}</span>`
            }
          }
        })
      })
    }
  },
  mounted() {
    this.renderSoldAmount()
    this.renderUserGrowthTrend()
    this.renderMap()
  }
}
</script>
<style>
::-webkit-scrollbar {
  display: none;
}

html,
body {
  overflow: hidden;
  margin: 0;
}

#map {
  height: 100%;
  width: 100%;
}
</style>
