<template>
  <el-form ref="form" :model="formModel" :rules="rules" label-width="60px">
    <el-row :gutter="20">
      <el-col :span="17">
        <el-form-item prop="title" label="标题">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="categoryId" label="栏目">
              <el-select v-model="formModel.categoryId" clearable filterable class="w-100">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" label="状态">
              <el-select v-model="formModel.status" clearable class="w-100">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-form-item prop="thumbnail" label="缩略图">
          <el-upload
            class="uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :on-change="_onChangeImage"
            :http-request="_uploadThumbnail"
          >
            <img v-if="formModel.thumbnail" :src="formModel.thumbnail" class="avatar">
            <i v-else v-loading="loading" class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="content" label="内容">
      <x-editor v-model="formModel.content" />
    </el-form-item>
    <el-form-item prop="summary" label="摘要">
      <el-input
        v-model="formModel.summary"
        type="textarea"
        maxlength="300"
        show-wrod-limt
        autosize
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="_save">保存</el-button>
      <el-button @click="_close">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import API from '@/api'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Edit',

  data () {
    return {
      loading: false,
      file: null,
      formModel: {
        title: '',
        content: '',
        keywords: '',
        summary: '',
        status: 1,
        categoryId: null,
        thumbnail: ''
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空' }
        ],
        categoryId: [
          { required: true, message: '栏目不能为空' }
        ]
      },

      statusList: [
        {
          label: '草稿',
          value: 0
        },
        {
          label: '发布',
          value: 1
        }
      ]
    }
  },

  computed: {
    ...mapState('article/category', {
      categoryList: state => state.flatList
    })
  },

  created () {
    this._getCategoryList()
  },

  methods: {
    ...mapMutations('article/articleList', ['UPDATE_CURRENT_PAGE']),
    ...mapActions('article/category', {
      getCategoryList: 'getList'
    }),

    async _getCategoryList () {
      window.common.showLoading('栏目加载中...')
      await this.getCategoryList()
      window.common.hideLoading()
      this.$route.params.id && this._getDetail()
    },

    async _getDetail () {
      try {
        window.common.showLoading('文章详情加载中...')
        const { data } = await API['article/article'].getDetail(this.$route.params.id)
        window.common.hideLoading()
        this.formModel = Object.assign(this.formModel, data.data)
      } catch (err) {
        window.common.hideLoading()
      }
    },

    _onChangeImage ({ raw }) {
      this.file = raw
    },

    async _upload () {
      try {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('type', 'editor')
        let { data } = await API.upload(formData)
        this.file = null
        return Promise.resolve(data.data)
      } catch (err) {
        window.common.showMessage({
          type: 'error',
          message: '图片上传失败'
        })
      }
      this.loading = false
    },

    async _uploadThumbnail () {
      this.loading = true
      let data = await this._upload()
      this.formModel.thumbnail = data[0].url
    },

    _save () {
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        window.common.showLoading('保存中...')
        await API['article/article'].save({
          ...this.formModel
        })
        window.common.hideLoading()
        window.common.showMessage({
          type: 'success',
          message: '文章保存成功'
        })
        this._close()
      })
    },

    _reset () {
      this.$refs.form.resetFields()
      this.$set(this, 'formModel', this.$options.data().formModel)
    },

    _close () {
      this._reset()
      this.$router.push({
        name: 'ArticleList'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader {
  $height: 120px;
  /deep/ .el-upload {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: $height;
    border: 1px dashed var(--color-border);
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      border-color: $color-theme;
    }
    .uploader-icon {
      width: 100%;
      height: $height;
      font-size: 28px;
      line-height: $height;
      text-align: center;
      color: inherit;
    }
    .avatar {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.upload-images {
  /deep/ .el-upload-list__item,
  /deep/ .el-upload--picture-card {
    width: 120px;
    height: 120px;
  }

  /deep/ .el-upload--picture-card {
    background: none;
    line-height: 120px;
  }
}
/deep/ .el-form-item__content {
  > .ck-editor__editable {
    min-height: 300px;
    border: 1px solid var(--color-border);
  }
}
</style>
