<template>
  <div style="height: 100%" id="bubble"></div>
</template>

<script>
import { Chart } from '@antv/g2'
import maxBy from 'lodash/maxBy'

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.initCircle(this.data)
    window.addEventListener('resize', this.onReszie)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onReszie)
  },
  methods: {
    onReszie() {
      this.initCircle(this.data)
    },
    initCircle(data) {
      const maxSize = document.getElementById('bubble').clientWidth / data.length / 2
      const maxItem = maxBy(data, it => it.value)
      const maxValue = Math.ceil(maxItem.value * 1.1)

      // 清空作图区域
      const chart = new Chart({
        container: 'bubble',
        autoFit: true,
        padding: 20
      })
      chart.data(data)
      chart.scale('value', {
        nice: true,
        max: maxValue
      })
      chart.legend(false)
      chart.axis('value', false)
      chart.axis('name', false)
      chart.tooltip({
        showMarkers: false
      })
      chart
        .point()
        .position('name*value')
        .size('value', value => {
          return (value / maxValue) * maxSize
        })
        .color('name')
        .shape('circle')
        .label('name*value', (name, value) => {
          return {
            content: `${name}\n${value}`,
            offsetY: 12,
            style: {
              fill: '#fff',
              fontSize: 12 // 文本大小
            }
          }
        })
      chart.render()
    }
  }
}
</script>
