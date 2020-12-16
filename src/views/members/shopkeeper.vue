<template>
  <a-card>
    <div class="hd">
      <span class="left">分销口令</span>
      <span class="right">生成分销口令给其他人，成功加入后，将成为你的掌柜为您分销商品</span>
    </div>
    <div class="btn-box">
      <a-button type="primary" class="btn" @click="showModal(1)">生成统一口令</a-button>
      <!-- <span v-if="meshTokenWord" style="margin-right:20px">已生成的口令：{{ meshTokenWord }}</span> -->
      <a-popover placement="right">
        <template slot="content">
          <p>生成统一口令：分享给多人，适用于群组或朋友圈等</p>
        </template>
        <a-icon class="tips-icon" type="info-circle" />
      </a-popover>
      <a-button type="primary" class="btn" @click="showModal(2)">生成唯一口令</a-button>
      <a-popover placement="right">
        <template slot="content">
          <p>生成唯一口令：分享给单人，一人一码</p>
        </template>
        <a-icon class="tips-icon" type="info-circle" />
      </a-popover>
      <router-link :to="{ path: '/members/shopkeeper/pwList' }" class="management">管理已生成的口令</router-link>
    </div>
    <a-input-group compact>
      <a-input-search
        placeholder="请输入手机号\掌柜姓名"
        style="width: 40%"
        v-model="keyword"
        enterButton="搜索"
        @search="onSearch"
      />
    </a-input-group>
    <div class="txt">掌柜列表</div>
    <a-row :gutter="48">
      <a-col :span="24">
        <a-table :data-source="rows" :columns="columns" :pagination="pagination" @change="onPageChage"></a-table>
      </a-col>
    </a-row>
    <a-modal
      v-model="visible"
      :title="wordType === 1 ? '统一口令生成' : '唯一口令生成'"
      @ok="handleOk"
      @cancel="handleCancel"
      :okText="btnName"
      :ok-button-props="{ props: { loading: loading } }"
    >
      <!-- <a-radio-group v-model="type" @change="onChange" v-if="wordType===1">
        <a-radio :value="1">随机生成口令</a-radio>
        <a-radio :value="2">
          自定义口令
          <a-input
            v-if="type===2"
            placeholder="请输入自定义口令"
            style="width: 200px;margin-left: 10px;"
            v-model="word"
            @change="inputWord"
          />
        </a-radio>
      </a-radio-group> -->
      <div v-if="wordType === 1">
        自定义口令：
        <a-input
          v-if="type === 2"
          placeholder="请输入自定义口令"
          style="width: 200px; margin-left: 10px"
          v-model="word"
          @change="inputWord"
        />
      </div>
      <pre class="copy" v-if="isShowCopy">
请您复制这个{{ this.wordType === 1 ? '统一' : '唯一' }}口令:{{ word }}
在「homaho」小程序中点击「我的」，再点击「我要加盟」，输入上方的口令，即可加盟我的homaho，成为我的分销掌柜。</pre
      >
    </a-modal>
  </a-card>
</template>

<script>
import { getDistributors, setPW, getMeshsInfo } from '@/api/salemans'
import { MESH_NO } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  data() {
    return {
      loading: false,
      pagination: {},
      keyword: '',
      word: '',
      btnName: '确定',
      wordType: 1,
      visible: false,
      isShowCopy: false,
      type: 2,
      rows: [],
      meshTokenWord: '',
      columns: [
        {
          title: '掌柜名称',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '加入时间',
          dataIndex: 'createdAt',
          key: 'createdAt'
        },
        {
          title: '总分销订单',
          dataIndex: 'totalSales',
          key: 'totalSales'
        },
        {
          title: '累计获得佣金',
          dataIndex: 'totalCommission',
          key: 'totalCommission'
        }
      ]
    }
  },
  created() {
    this.loadData()
    this.setMeshsInfo()
  },
  methods: {
    onSearch() {
      this.page = 1
      this.loadData()
    },
    async setMeshsInfo() {
      const { meta, data } = await getMeshsInfo({ mesh_no: Vue.ls.get(MESH_NO) })
      if (meta.code === 0) {
        this.meshTokenWord = data.meshTokenWord
      }
    },
    onPageChage(pagination) {
      this.page = pagination.current
      this.loadData()
    },
    showModal(val) {
      this.wordType = +val
      this.word = ''
      if (+val === 2) {
        this.isShowCopy = true
        this.btnName = '复制这段话'
        this.sendSetPw()
      } else {
        this.visible = true
        this.isShowCopy = false
        this.btnName = '确定'
      }
    },
    handleCancel() {
      this.isShowCopy = false
      this.btnName = '确定'
      this.visible = false
      this.type = 2
    },
    handleOk() {
      if (+this.type === 1 && this.isShowCopy === false) {
        this.isShowCopy = true
        this.btnName = '复制这段话'
      } else if (this.isShowCopy === true) {
        let val = `请您复制这个${this.wordType === 1 ? '统一' : '唯一'}口令:${this.word}\n在「homaho」小程序中点击「我的」，再点击「我要加盟」，输入上方的口令，即可加盟我的homaho，成为我的分销掌柜。`
        this.$copyText(val)
          .then(res => {
            this.$message.success('复制成功')
          })
          .catch(() => {
            this.$message.error('复制失败')
          })
      } else if (+this.type === 2 && this.isShowCopy === false) {
        if (this.word === '') {
          this.$message.warning('请输入自定义口令')
          return false
        }
        this.sendSetPw()
      }
    },
    async sendSetPw() {
      this.loading = true
      const { meta, data } = await setPW({ kind: this.wordType, mesh_token: this.word, mesh_no: Vue.ls.get(MESH_NO) })
      this.loading = false
      if (meta.resultCode === 0) {
        if (+this.wordType === 2) {
          this.visible = true
          this.word = data.tokenWord
        }
        this.$message.success('操作成功！')
        this.isShowCopy = true
        this.btnName = '复制这段话'
      }
    },
    onChange(e) {
      this.isShowCopy = false
      this.btnName = '确定'
    },
    inputWord() {
      this.isShowCopy = false
      this.btnName = '确定'
    },
    async loadData() {
      const params = {
        pageNum: this.page,
        pageSize: this.pagination.pageSize
      }
      const {
        data: { page, meta, list }
      } = await getDistributors(Object.assign(params, { keyword: this.keyword }))
      this.meta = meta
      this.pagination = {
        pageSize: page.pageSize,
        total: page.total
      }
      this.rows = list
    }
  }
}
</script>

<style lang="less" scoped>
.hd {
  width: 100%;
  margin-bottom: 20px;
  .left {
    font-size: 20px;
    font-weight: bold;
    margin-right: 20px;
  }
  .right {
    font-size: 16px;
  }
}
.btn-box {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  .btn {
    margin-left: 20px;
    margin-right: 10px;
  }
  .btn:first-child {
    margin-left: 0;
  }
  .management {
    margin-left: 20px;
  }
}
.txt {
  width: 100%;
  font-size: 20px;
  padding-top: 20px;
  margin-bottom: 20px;
}
.copy {
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
  font-size: 16px;
  background-color: #f7f7f7;
  border-radius: 8px;
  color: rgb(41, 42, 43);
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 20px;
}
</style>
