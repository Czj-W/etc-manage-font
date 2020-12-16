<template>
  <div class="rows">
    <div v-for="row in data" :key="row.key">
      <div class="row__title">{{ row.title }}</div>
      <div class="row">
        <div class="row__image">
          <img :src="row.image" />
        </div>
        <div class="area">
          <div class="area__percent" :style="`width: ${percent(row.value)}%`"></div>
          <div class="area__info">
            <div class="row__value">￥{{ format(row.value) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bignumber from 'bignumber.js'
import maxBy from 'lodash/maxBy'

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    max() {
      const row = maxBy(this.data, row => row.value)
      return row.value
    }
  },
  methods: {
    format(money) {
      return new Bignumber(money).toFormat()
    },
    percent(value) {
      return new Bignumber(value).dividedBy(this.max).multipliedBy(100)
    }
  }
}
</script>

<style scoped>
.rows {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.row {
  display: flex;
}
.rows > .row:not(:first-child) {
  margin-top: 10px;
}
.row__image > img {
  height: 30px;
}
.area {
  flex: 1;
  height: 30px;
  margin-left: 5px;
  background: #2f475e4d;
  position: relative;
}
.area__percent {
  height: 100%;
  background: #02a6f299;
}
.area__info {
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1;
  top: 0;
}
.row__title {
  width: 100px;
  color: #ccc;
}
.row__info > .row__value {
  margin-left: 20px;
}
</style>
