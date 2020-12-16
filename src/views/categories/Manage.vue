<template>
  <div>
    <a-row>
      <a-col>
        <a-button type="primary" @click="modalVisible = true">添加分类</a-button>
      </a-col>
    </a-row>

    <a-row class="desc">
      <a-col class="statistics">
        <span>本{{ title }}共 {{ rows.length }} 个分类</span>
        <span v-for="row in rows" :key="row.id">{{ row.name }}</span>
      </a-col>
    </a-row>

    <a-row class="table">
      <a-col>
        <a-table :columns="columns" rowKey="id" :dataSource="rows" bordered></a-table>
      </a-col>
    </a-row>
    <a-modal
      :visible="modalVisible"
      title="添加分类"
      ok-text="确认"
      cancel-text="取消"
      @ok="() => create()"
      @cancel="modalVisible=false">
      <a-form-model ref="form" :model="form" :rules="rules" v-bind="categoryFormLayout">
        <a-form-model-item label="添加分类" prop="name">
          <a-input v-model="form.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import categoryApi from '@/api/category'
export default {
  data() {
    return {
      modalVisible: false,
      title: '',
      form: {
        name: ''
      },
      rules: {
        name: { required: true, message: '请填写', trigger: 'change' }
      },
      categoryFormLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 }
      },
      rows: [],
      editRow: null,
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '分类名称',
          dataIndex: 'name'
        },
        {
          title: '包含商品数量',
          dataIndex: 'goodsCount'
        },
        {
          title: '包含商品',
          customRender: (text, row, index) => {
            return {
              children: <a onclick={() => this.jumpLook(row)}>查看</a>
            }
          }
        },
        {
          title: '调整顺序',
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="sort">
                  {index > 0 ? <a onclick={() => this.moveUp(index)}>上移</a> : <span>上移</span>}
                  {index < this.rows.length - 1 ? <a onclick={() => this.moveDown(index)}>下移</a> : <span>下移</span>}
                </div>
              )
            }
          }
        },
        {
          title: '操作',
          customRender: (text, row, index) => {
            return {
              children: (
                <div class="actions">
                  {row.goodsCount ? (
                      <a onclick={() => this.showDeleteConfirm(row)}>删除</a>
                  ) : (
                    <a onclick={() => this.del(row.id)}>删除</a>
                  )}
                  <a onclick={() => this.edit(row)}>编辑</a>
                </div>
              )
            }
          }
        }
      ]
    }
  },
  created() {
    this.title = process.env.VUE_APP_PROJECT_TYPE === 'YUNPI' ? '云铺' : '格子铺'
  },
  mounted() {
    this.getList()
  },
  methods: {
    jumpLook(row) {
      this.$router.push({
        path: `/categories/${row.id}/products`,
        query: {
          name: row.name
        }
      })
    },
    async create() {
      await this.$refs.form.validate()
      if (this.form.name.trim() === '') {
        this.$message.error('请输入分类名！')
        return
      }
      if (this.editRow && this.editRow.id) {
        await categoryApi.update(this.editRow.id, this.form)
      } else {
        await categoryApi.create(this.form)
      }
      this.$refs.form.resetFields()
      this.modalVisible = false
      this.editRow = null
      this.getList()
    },
    async getList() {
      const {
        data: { categories }
      } = await categoryApi.list()
      this.rows = categories
    },
    showDeleteConfirm(row) {
      const that = this
      this.$confirm({
        title: '确认删除吗？',
        content: `所删分类包含：${row.goodsCount}件商品`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // console.log(that)
          that.del(row.id)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    async del(id) {
      await categoryApi.del(id)
      this.$message.success('删除成功!')
      this.getList()
    },
    async sort(fromId, toId) {},
    async moveUp(index) {
      await categoryApi.sort(this.rows[index].id, this.rows[index - 1].id)
      this.getList()
    },
    async moveDown(index) {
      await categoryApi.sort(this.rows[index].id, this.rows[index + 1].id)
      this.getList()
    },
    edit(row) {
      this.editRow = row
      this.form.name = row.name
      this.modalVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.desc {
  margin-top: 20px;
}
.statistics > span:not(:first-child) {
  margin-left: 20px;
}
.table {
  margin-top: 20px;
}
.sort > :not(:first-child) {
  margin-left: 10px;
}
.actions > :not(:first-child) {
  margin-left: 10px;
}
</style>
