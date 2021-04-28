<template>
  <el-drawer
    title="文件详情"
    direction="rtl"
    :visible="visible"
    size="600px"
    @close="_close"
  >
    <div class="content">
      <div class="file-preview">
        <video v-if="isVideo" :src="data.url" controls />
        <audio v-else-if="isAudio" :src="data.url" controls />
        <img v-else :src="data.preview" />
      </div>

      <el-divider />

      <el-row class="file-info" :gutter="15">
        <el-col class="file-info__item" :span="12">
          <span class="file-info__title">文件名：</span>
          <span class="file-info__text">{{ data.filename }}</span>
        </el-col>
        <el-col class="file-info__item" :span="12">
          <span class="file-info__title">文件类型：</span>
          <span class="file-info__text">{{ data.type }}</span>
        </el-col>
      </el-row>
      <el-row class="file-info" :gutter="15">
        <el-col class="file-info__item m-t-10px" :span="12">
          <span class="file-info__title">文件大小：</span>
          <span class="file-info__text">{{ data.size }}</span>
        </el-col>
        <el-col class="file-info__item m-t-10px" :span="12">
          <span class="file-info__title">上传时间：</span>
          <span class="file-info__text">{{ data.createTime | formatDate }}</span>
        </el-col>
      </el-row>
      <el-row class="file-info" :gutter="15">
        <el-col class="file-info__item m-t-10px" :span="24">
          <span class="file-info__title">文件地址：</span>
          <span class="file-info__text">
            <el-tag class="c-pointer m-r-5px" @click="_copyUrl">点击复制</el-tag>
            <input ref="copyInput" type="text" class="copy-input" :value="data.url">
          </span>
        </el-col>
      </el-row>

      <el-divider />

      <el-popconfirm
        :value="showDelPopver"
        placement="top"
        width="250"
        title="删除操作不可逆，确认删除改文件吗？"
        confirm-button-text="确认"
        cancel-button-text="取消"
        @confirm="_delFile"
      >
        <el-button
          slot="reference"
          type="danger"
          @click="showDelPopver = true"
        >
          删除
        </el-button>
      </el-popconfirm>
    </div>
  </el-drawer>
</template>

<script>
import API from '@/api'
import { getQueryParams } from '@/utils'
import { mapMutations } from 'vuex'
export default {
  name: 'FileDetail',

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      delLoading: false,
      showDelPopver: false
    }
  },

  computed: {
    isImage() {
      return /^image/.test(this.data.type)
    },
    isVideo() {
      return /^video/.test(this.data.type)
    },
    isAudio() {
      return /^audio/.test(this.data.type)
    }
  },

  methods: {
    ...mapMutations('media', ['DELETE_FILE_ITEM']),
    _copyUrl() {
      this.$refs.copyInput.select()
      const copyed = document.execCommand('Copy')
      this.$_Dcommon.showMessage({
        type: copyed ? 'success' : 'error',
        message: copyed ? '复制成功' : '复制失败'
      })
    },

    async _delFile() {
      try {
        this.delLoading = true
        await API.media.delFile({
          path: getQueryParams(this.data.url).path
        })
        this.delLoading = false
        this.showDelPopver = false
        this.$_Dcommon.showMessage({
          type: 'success',
          message: '删除成功'
        })
        this.DELETE_FILE_ITEM(this.data.filename)
        this._close()
      } catch (err) {
        this.showDelPopver = false
        this.delLoading = false
      }
    },

    _close() {
      this.$emit('update:visible', false)
      this.$emit('update:data', {})
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 95%;
  margin: 0 auto;
}
.file-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  img,
  video {
    max-height: 100%;
  }
}
.file-info {
  .file-info__item {
    display: flex;
  }
  .file-info__title {
    font-weight: bold;
    word-break: keep-all;
  }
  .file-info__text {
    flex: 1;
    word-break: break-all;
  }
  .copy-input {
    width: 80%;
    font-size: 14px;
  }
}
</style>
