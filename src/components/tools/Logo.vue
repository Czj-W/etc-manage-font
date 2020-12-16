<template>
  <div class="logo">
    <!-- <router-link :to="{name:'dashboard'}">
      <img :src="currentMesh && currentMesh.head_avatar_url_with_default" />
      <h1 v-if="showTitle">{{ currentMesh && currentMesh.name }}</h1>
    </router-link>-->
    <a-dropdown>
      <span class="action ant-dropdown-link">
        <img :src="currentMesh && currentMesh.headAvatarUrlWithDefault" />
        <h1 v-if="showTitle" class="title">{{ currentMesh && currentMesh.name }}</h1>

        <a-icon type="down" :style="{ color: 'white', fontSize: '10px'}" />
      </span>
      <a-menu slot="overlay">
        <a-menu-item
          :value="mesh.meshNo"
          v-for="mesh in meshes"
          :key="mesh.meshNo"
          @click="onMeshNoChange(mesh.meshNo)"
        >
          <span>{{ mesh.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Logo',
    props: {
      title: {
        type: String,
        default: '格子圈',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    computed: {
      ...mapGetters(['currentMesh', 'meshes'])
    },
    methods: {
      ...mapActions(['SwitchMeshNo']),
      onMeshNoChange(meshNo) {
        this.SwitchMeshNo(meshNo)
        // this.$router.push({ path: '/' })
        this.$router.go(0)
      }
    }
  }
</script>
<style lang="less">
  // .anticon-down{
  //   >svg{
  //   width: 20px;
  //   height: 20px;
  //   }
  // }
  .sider .logo svg {
    height: 22px !important;
    width: 22px !important;
  }
  .title {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
