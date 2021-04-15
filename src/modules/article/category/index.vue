<template>
  <div class="container">
    <x-table-container>
      <template #btnGroup>
        <el-button type="primary" @click="_add()">新增</el-button>
      </template>

      <el-table :data="list" border row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="编码" prop="code"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="类型" prop="type" width="80" align="center">
          <template v-slot="{ row }">
            <span v-if="row.type === 'list'">列表</span>
            <span v-if="row.type === 'page'">页面</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可见" prop="type" width="80" align="center">
          <template v-slot="{ row }">
            <x-dot-tag v-if="row.visible" type="success">是</x-dot-tag>
            <x-dot-tag v-else>否</x-dot-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布人" prop="userDisplayName" width="130" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template v-slot="{ row }">{{ row.createTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="{ row }">
            <el-link type="primary" size="mini" @click="_add(row)">添加</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link type="primary" size="mini" @click="_edit(row)">编辑</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link type="primary" size="mini" @click="_del(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </x-table-container>

    <edit
      :visible.sync="showEdit"
      :data.sync="editData"
      :type.sync="editType"
      @success="init"
    />
  </div>
</template>

<script>
import API from '@/api'
import { mapState, mapActions } from 'vuex'
import Edit from './components/edit'
import { isEmpty } from '@/utils'
export default {
  name: 'Category',

  components: {
    Edit
  },

  data () {
    return {
      showEdit: false,
      editData: {},
      editType: 'add'
    }
  },

  computed: {
    ...mapState('article/category', ['tree']),

    list() {
      return isEmpty(this.tree) ? [] : this.tree[0].children
    }
  },

  created () {
    this.init()
  },

  methods: {
    ...mapActions('article/category', ['getList']),

    async init () {
      this.$_D_common.showLoading()
      await this.getList()
      this.$_D_common.hideLoading()
    },

    _add (row = {}) {
      this.editData.parentId = row.id || 0
      this.editData.path = row.path || ''
      this.showEdit = true
    },

    _edit (data) {
      this.showEdit = true
      this.editData = data
      this.editType = 'edit'
    },

    _del (id) {
      this.$_D_common.confirm({
        title: '警告',
        message: '确认删除该栏目吗？',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            this.$_D_common.showLoading('删除中...')
            await API['article/category'].del({ id })
            this.$_D_common.hideLoading()
            this.init()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
