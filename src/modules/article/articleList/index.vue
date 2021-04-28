<template>
  <div class="container">
    <x-table-container>
      <template #btnGroup>
        <el-button type="primary" @click="_goEdit">新增</el-button>
      </template>

      <d-table
        :request-method="getTableData"
      >
        <template v-slot:status="{ row }">
          <x-dot-tag v-if="row.status === 0">草稿</x-dot-tag>
          <x-dot-tag v-else-if="row.status === 1" type="success">已发布</x-dot-tag>
        </template>
        <template v-slot:createTime="{ row }">{{ row.createTime | formatDate }}</template>
        <template v-slot:operation="{ row }">
          <el-link type="primary" size="mini" @click="_edit(row)">编辑</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="primary" size="mini" @click="_del(row.id)">删除</el-link>
        </template>
      </d-table>
    </x-table-container>
  </div>
</template>

<script>
import API from '@/api'
export default {
  name: 'Article',
  methods: {
    async getTableData(params) {
      this.$_Dcommon.showLoading()
      const { data, count } = await API['article/article'].getList({
        ...params
      })
      this.$_Dcommon.hideLoading()
      return {
        header: [
          { name: '标题', column: 'title' },
          { name: '状态', column: 'status', width: 100, align: 'center' },
          { name: '栏目', column: 'categoryName', width: 130, align: 'center' },
          { name: '发布人', column: 'userDisplayName', width: 130, align: 'center' },
          { name: '创建时间', column: 'createTime', width: 160, align: 'center' },
          { name: '操作', column: 'operation', width: 120 },
        ],
        data,
        count
      }
    },

    _goEdit (data = {}) {
      this.$router.push({
        name: 'ArticleEdit',
        query: {
          id: data.id
        }
      })
    },

    _edit (data) {
      this._goEdit(data)
    },

    _del (id) {
      this.$_Dcommon.confirm({
        title: '警告',
        message: '确认删除该文章吗？',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            this.$_Dcommon.showLoading('删除中...')
            await API['article/article'].del({ id })
            this.$_Dcommon.hideLoading()
            this.init()
          }
        }
      })
    }
  }
}
</script>
