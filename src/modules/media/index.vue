<template>
  <div class="container">
    <el-button icon="el-icon-upload2" type="primary" @click="_add">上传文件</el-button>
    <el-button @click="_add">新建文件夹</el-button>

    <div class="breadcrumb m-t-20px">
      <template>
        <span v-if="isRoot">全部文件</span>
        <template v-else>
          <el-link type="primary" @click="_back">返回上一级</el-link>
          <el-divider direction="vertical"></el-divider>
        </template>
      </template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
          <el-link v-if="index !== breadcrumb.length - 1" type="primary" @click="_breadcrumbHandler(item, index)">{{ item }}</el-link>
          <span v-else>{{ item }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-divider />

    <ul class="list-wrapper">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item align-center"
        :title="item.filename"
        @click="_enterDirectory(item)"
      >
        <el-image :src="item.preview" class="item--image" fit="contain">
          <template #placeholder>
            <div class="h-100 flex f-a-center f-j-justify">
              <x-svg-icon icon="loading" />
            </div>
          </template>
        </el-image>
        <p class="w-100 m-t-10px item--title">{{ item.filename }}</p>
      </li>
    </ul>

    <file-detail :visible.sync="showFileDetail" :data.sync="currentFile" />
  </div>
</template>

<script>
import { isEmpty } from '@/utils'
import { mapState, mapActions } from 'vuex'
import FileDetail from './components/FileDetail'

export default {
  name: 'Media',

  components: {
    FileDetail
  },

  data() {
    return {
      currentFile: {},
      showFileDetail: false,
    }
  },

  computed: {
    ...mapState('media', ['list']),

    breadcrumb() {
      return (this.$route.query.path || '').split('/').filter(item => item)
    },

    isRoot() {
      return isEmpty(this.breadcrumb)
    }
  },

  created() {
    this._getDirectoryList()
  },

  methods: {
    ...mapActions('media', ['readDirectory']),

    async _getDirectoryList() {
      try {
        window.common.showLoading('加载中...')
        await this.readDirectory({
          path: this.$route.query.path
        })
        window.common.hideLoading()
      } catch(err) {
        window.common.hideLoading()
      }
    },

    _enterDirectory(data) {
      const { isDirectory, filename } = data
      if (isDirectory) {
        this.$router.replace({
          name: 'Media',
          query: {
            path: `${this.$route.query.path || ''}/${filename}`
          }
        })
        this._getDirectoryList()
      } else {
        this.showFileDetail = true
        this.currentFile = data
      }
    },

    _breadcrumbHandler(dir, index) {
      this.$router.replace({
        name: 'Media',
        query: {
          path: `${this._findPath(index).join('/')}/${dir}`
        }
      })
      this._getDirectoryList()
    },

    _findPath(index) {
      const path = []
      for (let i = 0; i < index; i++) {
        path.push(this.breadcrumb[i])
      }
      return path
    },

    _back() {
      this.$router.replace({
        name: 'Media',
        query: {
          path: `${this._findPath(this.breadcrumb.length - 1).join('/')}`
        }
      })
      this._getDirectoryList()
    },

    _add() {
      window.common.showMessage({
        type: 'warning',
        message: '功能正在开发中'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;

  /deep/ a {
    font-weight: initial;
  }

  /deep/ .el-breadcrumb__separator,
  /deep/ .el-breadcrumb__inner {
    vertical-align: middle;
  }
}
.list-wrapper {
  display: flex;
  flex-wrap: wrap;

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 130px;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: #f1f5fa;
    }
  }

  .item--image {
    height: calc(120px - 30px);
  }

  .item--title {
    @extend %ellipsis;
    font-size: 12px;
  }
}
</style>
