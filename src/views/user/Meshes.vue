
<template>
  <div class="meshes-wrapper">
    <a
      style="width: 300px"
      :value="mesh.meshNo"
      v-for="mesh in meshes"
      :key="mesh.meshNo"
      @click="onMeshNoChange(mesh.meshNo)"
    >
      <a-card>
        <a-card-meta :title="mesh.name" description>
          <a-avatar slot="avatar" :src="mesh.headAvatarUrlWithDefault" />
        </a-card-meta>
      </a-card>
    </a>
  </div>
</template>
<script>
// mport md5 from 'md5'
// import { mapActions } from 'vuex'
// import { timeFix } from '@/utils/util'
// import { getSmsCaptcha } from '@/api/login'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {}
  },
  created() {
    // get2step({})
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  computed: {
    ...mapGetters(['currentMesh', 'meshes'])
  },
  methods: {
    ...mapActions(['SwitchMeshNo']),
    onMeshNoChange(meshNo) {
      this.SwitchMeshNo(meshNo)
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="less" scoped>
.meshes-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > a {
    margin: 15px;
  }
}
</style>
