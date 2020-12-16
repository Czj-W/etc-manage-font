<template>
  <div id="map"></div>
</template>

<script>
import { Chart } from '@antv/g2'
import DataSet from '@antv/data-set'

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.$nextTick(() => this.renderMap())
  },
  methods: {
    async renderMap() {
      // 地图
      const response = await fetch('/china.json')
      const mapData = await response.json()
      const features = mapData.features

      const width = document.getElementById('map').clientWidth - 100
      const height = (width * 3) / 4

      const chart = new Chart({
        container: 'map',
        // autoFit: true,
        localRefresh: true,
        // autoFit: true,
        width,
        height
      }).axis(false)

      chart.scale({
        longitude: {
          sync: true
        },
        latitude: {
          sync: true
        }
      })

      chart.legend(false)

      // 用于地图背景层的绘制
      const bgData = []
      for (let i = 0; i < features.length; i++) {
        const name = features[i].properties.name
        bgData.push({
          name: name
        })
      }

      const bgView = chart.createView()
      bgView.data(bgData)
      bgView.tooltip(false)

      const ds = new DataSet()
      const map = ds.createView().source(mapData, {
        type: 'GeoJSON'
      })
      const mapView = chart.createView()
      mapView.data(map.rows)
      mapView.tooltip(false)
      mapView
        .polygon()
        .position('longitude*latitude')
        .style({
          fill: '#07152a',
          stroke: '#014156',
          lineWidth: 1
        })

      const userDv = ds
        .createView()
        .source(this.data)
        .transform({
          geoDataView: map,
          field: 'name',
          type: 'geo.centroid',
          as: ['longitude', 'latitude']
        })

      const userView = chart.createView()
      userView.data(userDv.rows)
      userView
        .point()
        .position('longitude*latitude')
        .color('value', this.colors)
        .shape('circle')
        .size('value', value => value / 500)
        .style('value', value => {
          return {
            lineWidth: 1,
            stroke: this.colors(value)
          }
        })
        .label('name', {
          offset: 0,
          style: {
            color: '#fff'
          }
        })

      userView.legend(false)
      chart.render()
    },
    colors(value) {
      if (value <= 3000) {
        return '#fff'
      }
      if (value <= 4000) {
        return '#ffeb3b'
      }
      if (value <= 5000) {
        return '#f35c57'
      }
    }
  }
}
</script>
<style>
#map > div {
  text-align: center;
  position: absolute !important;
  bottom: 10%;
}
</style>
<style scoped>
#map {
  height: 100%;
  width: 100%;
  padding: 20px 50px;
  margin: 0 auto;
  position: relative;
}
</style>
