<template>
  <div class="container">
    <x-table-container>
      <template #btnGroup>
        <el-button type="primary" @click="_goEdit">新增</el-button>
      </template>

      <el-table :data="list" border>
        <el-table-column label="缩略图" prop="thumbnail" width="100" align="center">
          <template v-slot="{ row }">
            <el-image v-if="row.thumbnail" :src="row.thumbnail"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template v-slot="{ row }">
            <x-dot-tag v-if="row.status === 0">草稿</x-dot-tag>
            <x-dot-tag v-else-if="row.status === 1" type="success">已发布</x-dot-tag>
          </template>
        </el-table-column>
        <el-table-column label="栏目" prop="categoryName" width="130" align="center"></el-table-column>
        <el-table-column label="发布人" prop="userDisplayName" width="130" align="center"></el-table-column>
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
    </x-table-container>
  </div>
</template>

<script>
import API from '@/api'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Article',
  computed: {
    ...mapState('article/articleList', ['list', 'total', 'limit', 'currentPage'])
  },
  created () {
    this.init()
  },
  methods: {
    ...mapMutations('article/articleList', ['UPDATE_CURRENT_PAGE']),
    ...mapActions('article/articleList', ['getList']),

    async init () {
      window.common.showLoading()
      await this.getList()
      window.common.hideLoading()
    },

    _pageChange (page) {
      this.UPDATE_CURRENT_PAGE(page)
      this.init()
    },

    _goEdit (data = {}) {
      this.$router.push({
        name: 'ArticleEdit',
        params: {
          id: data.id
        }
      })
    },

    _edit (data) {
      this._goEdit(data)
    },

    _del (id) {
      window.common.confirm({
        title: '警告',
        message: '确认删除该文章吗？',
        type: 'warning',
        callback: async action => {
          if (action === 'confirm') {
            window.common.showLoading('删除中...')
            await API.article.del({ id })
            window.common.hideLoading()
            this.init()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
