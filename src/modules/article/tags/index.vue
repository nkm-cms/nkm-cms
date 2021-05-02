<template>
  <x-table-container>
    <template #btnGroup>
      <el-button type="primary" @click="_add">新增</el-button>
    </template>

    <d-table ref="table" :request-method="_getList">
      <template v-slot:createTime="{ row }">{{ row.createTime | formatDate }}</template>
      <template v-slot:operation="{ row }">
        <el-link type="primary" size="mini" @click="_edit(row)">编辑</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link type="primary" size="mini" @click="_del(row.id)">删除</el-link>
      </template>
    </d-table>

    <tags-edit
      :visible.sync="showEdit"
      :data="editData"
      :type.sync="editType"
      @close="_closeEdit"
      @success="reload"
    />
  </x-table-container>
</template>

<script>
import API from '@/api'
import TagsEdit from './components/edit'

export default {
  name: 'Tags',

  components: {
    TagsEdit
  },

  data() {
    return {
      showEdit: false,

      editData: {},
      editType: 'add'
    }
  },

  methods: {
    async _getList(params) {
      this.$_Dcommon.showLoading('列表加载中...')
      const { data, count } = await API['article/tags'].getList(params)
      this.$_Dcommon.hideLoading()
      return {
        data,
        count,
        header: [
          { name: '名称', column: 'name' },
          { name: '编码', column: 'code' },
          { name: '创建时间', align: 'center', column: 'createTime', width: '160' },
          { name: '操作', column: 'operation', align: 'center', width: '120' }
        ]
      }
    },

    reload() {
      this.$refs.table.reload()
    },

    _add() {
      this.showEdit = true
    },

    _edit(row) {
      this.editData = row
      this.editType = 'edit'
      this.showEdit = true
    },

    _del(id) {
      this.$_Dcommon.confirm({
        title: '警告',
        message: '确认删除该标签吗？',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            this.$_Dcommon.showLoading('删除中...')
            await API['article/tags'].del({ id })
            this.$_Dcommon.hideLoading()
            this.$_Dcommon.showMessage({
              type: 'success',
              message: '删除成功'
            })
            this._getList()
          }
        }
      })
    },

    _closeEdit() {
      this.editData = {}
    }
  }
}
</script>
