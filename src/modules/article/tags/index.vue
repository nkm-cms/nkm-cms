<template>
  <x-table-container>
    <template #btnGroup>
      <el-button type="primary" @click="_add">新增</el-button>
    </template>

    <el-table :data="list" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="编码"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template v-slot="{ row }">{{ row.createTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template v-slot="{ row }">
          <el-link type="primary" size="mini" @click="_edit(row)">编辑</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="primary" size="mini" @click="_del(row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <template #pagination>
      <x-pagination
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="_pageChange"
      />
    </template>

    <tags-edit
      :visible.sync="showEdit"
      :data="editData"
      :type.sync="editType"
      @close="_closeEdit"
      @success="_getList(true)"
    />
  </x-table-container>
</template>

<script>
import API from '@/api'
import TagsEdit from './components/edit'
import { mapState, mapMutations, mapActions } from 'vuex'
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

  computed: {
    ...mapState('article/tags', ['list', 'total', 'currentPage', 'limit'])
  },

  created() {
    this._getList(true)
  },

  methods: {
    ...mapMutations('article/tags', ['UPDATE_CURRENT_PAGE']),
    ...mapActions('article/tags', ['getList']),

    async _getList(isReset) {
      isReset && this.UPDATE_CURRENT_PAGE(1)
      window.common.showLoading('列表加载中...')
      await this.getList()
      window.common.hideLoading()
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
      window.common.confirm({
        title: '警告',
        message: '确认删除该标签吗？',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            window.common.showLoading('删除中...')
            await API['article/tags'].del({ id })
            window.common.hideLoading()
            window.common.showMessage({
              type: 'success',
              message: '删除成功'
            })
            this._getList(true)
          }
        }
      })
    },

    _closeEdit() {
      this.editData = {}
    },

    _pageChange(page) {
      this.UPDATE_CURRENT_PAGE(page)
      this._getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
