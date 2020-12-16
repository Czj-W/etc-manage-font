<template>
  <a-card>
    <a-radio-group
      :default-value="kind"
      v-model="kind"
      button-style="solid"
      style="margin-bottom:20px"
      @change="onModeChange"
    >
      <a-radio-button value="1">统一口令</a-radio-button>
      <a-radio-button value="2">唯一口令</a-radio-button>
    </a-radio-group>
    <a-row :gutter="48">
      <a-col :span="24">
        <a-table :data-source="rows" :columns="columns" :pagination="false" @change="onPageChage"></a-table>
      </a-col>
    </a-row>
    <a-modal v-model="visible" title="加入人员" :footer="null" width="50%">
      <p>{{ +this.kind === 1 ? '统一' : '唯一' }}口令：{{ tagretWord }}</p>
      <a-table
        :data-source="modelRows"
        :columns="modelColumns"
        :pagination="modelPagination"
        @change="onModelPageChage"
      ></a-table>
    </a-modal>
  </a-card>
</template>

<script>
import { getListByType, update, getJoinList } from '@/api/salemans'

export default {
  data() {
    return {
      visible: false,
      pagination: {},
      rows: [],
      kind: '1',
      tagretWord: '',
      page: 1,
      columns: [
        {
          title: '口令',
          dataIndex: 'tokenWord',
          key: 'tokenWord'
        },
        {
          title: '生成时间',
          dataIndex: 'createdAt',
          key: 'createdAt'
        },
        {
          title: '加入结果',
          dataIndex: 'memberCount',
          key: 'memberCount'
        },
        {
          title: '操作',
          customRender: (text, row, index) => {
            return {
              children: (
                <div>
                  {row.status === 'open' || row.status === 'close' ? (
                    <a class="btn" onclick={() => this.setStatus(row)}>
                      {row.status === 'open' ? '关闭' : '开启'}口令
                    </a>
                  ) : (
                    <a class="btn" disabled>
                      {row.status === 'used' ? '已使用' : '已失效'}口令
                    </a>
                  )}
                  <a onclick={() => this.showMemeber(row)}>查看加入人员</a>
                </div>
              )
            }
          }
        }
      ],
      modelRows: [],
      modelColumns: [
        {
          title: '掌柜名称',
          dataIndex: 'userName',
          key: 'userName'
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
        }
      ],
      modelPagination: {}
    }
  },
  mounted() {
    this.getListByType()
  },
  methods: {
    onPageChage() {},
    onModeChange() {
      this.getListByType()
    },
    onModelPageChage(pagination) {
      this.page = pagination.current
      this.showMemeber()
    },
    async setStatus(e) {
      let status = 1
      if (e.status === 'open') {
        status = 0
      }
      let id = e.id
      const { meta } = await update(id, { status })
      if (meta.resultCode === 0) {
        this.$message.success('更新成功')
        this.getListByType()
      } else if (meta.resultCode === 1000) {
        this.$message.warn(meta.result)
      }
    },
    async showMemeber(e) {
      let id = e.id
      const { meta, data } = await getJoinList(id, { page: this.page })
      if (meta.code === 0) {
        this.modelRows = data.list
        this.visible = true
        this.tagretWord = e.tokenWord
        this.pagination = {
          pageSize: data.page.pageSize,
          total: data.page.total
        }
      }
      console.log(data, 123)
    },
    async getListByType() {
      const { data } = await getListByType({ kind: +this.kind })
      this.rows = data
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  margin-right: 10px;
}
</style>
