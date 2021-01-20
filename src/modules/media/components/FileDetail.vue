<template>
  <el-drawer
    title="文件详情"
    direction="rtl"
    :visible="visible"
    width="400px"
    append-to-body
    @close="_close"
  >
    <div class="content">
      <div class="file-preview">
        <img :src="data.preview" alt="">
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
          <span class="file-info__text">{{ data.size }}(格式化还在开发)</span>
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
    </div>
  </el-drawer>
</template>

<script>
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

  methods: {
    _copyUrl() {
      this.$refs.copyInput.select()
      const copyed = document.execCommand('Copy')
      window.common.showMessage({
        type: copyed ? 'success' : 'error',
        message: copyed ? '复制成功' : '复制失败'
      })
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
  width: 90%;
  margin: 0 auto;
}
.file-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  img {
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
