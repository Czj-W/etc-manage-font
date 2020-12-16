<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {
    window.addEventListener('offline', () => {
      this.$notification.warning({
        message: '网站提示',
        description: '请检查是否连接网络'
      })
      console.log('已断网')
    })
  }
}
</script>
