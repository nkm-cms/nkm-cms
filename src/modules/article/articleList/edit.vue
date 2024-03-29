<template>
  <el-form ref="form" :model="formModel" :rules="rules" label-width="60px">
    <el-alert
      title="还请各位朋友体验的时候，上传文件不要上传违法的视频、音频、图片等，咱们要做一个好公民，谢谢。"
      type="warning"
      class="m-b-20px"
      :closable="false"
    />
    <el-row :gutter="40">
      <el-col :span="17">
        <el-form-item prop="title" label="标题">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <x-editor v-model="formModel.content" @change="_editorChange" />
        </el-form-item>
      </el-col>

      <el-col :span="7">
        <el-form-item label-width="0">
          <el-button type="primary" @click="_save">发布</el-button>
          <el-button @click="_preview">预览</el-button>
          <el-button @click="_close">返回</el-button>
        </el-form-item>

        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="文章状态" name="1">
            <el-checkbox v-model="formModel.top" :true-label="1" :false-label="0">是否置顶</el-checkbox>
            <el-checkbox v-model="formModel.status" :true-label="0" :false-label="1">保存草稿</el-checkbox>
          </el-collapse-item>
          <el-collapse-item title="分类" name="2">
            <el-form-item prop="categoryId" label-width="0">
              <x-select-tree
                v-model="formModel.categoryId"
                :data="categoryList"
                clearable
                class="w-100"
                :tree-props="{
                  label: 'name'
                }"
              />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="标签" name="3">
            <el-form-item label-width="0">
              <el-select
                v-model="formModel.tags"
                multiple
                class="w-100"
                filterable
                value-key="id"
              >
                <el-option
                  v-for="item in tagsAllList"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                />
              </el-select>
              <span class="f-s-12px color-sub-text">(标签添加请至标签列表处添加)</span>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="缩略图" name="4">
            <el-form-item prop="thumbnail" label-width="0">
              <div
                v-loading="loading"
                class="uploader"
                @click="_uploadThumbnail"
              >
                <img v-if="formModel.thumbnail" :src="formModel.thumbnail" class="avatar" />
                <i v-else class="el-icon-plus uploader-icon"></i>
              </div>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="摘要" name="5">
            <el-form-item prop="summary" label-width="0">
              <el-input
                v-model="formModel.summary"
                type="textarea"
                maxlength="300"
                :rows="3"
                show-wrod-limt
                autosize
              />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import API from '@/api'
import uploadFile, { selectFileHandler } from '@/utils/upload'
import { mapState, mapActions, mapMutations } from 'vuex'
import { isEmpty } from '@/utils'

export default {
  name: 'Edit',

  data () {
    return {
      activeCollapse: ['1', '2'],
      loading: false,
      editorStyle: [],
      formModel: {
        title: '',
        content: '',
        keywords: '',
        summary: '',
        status: 0,
        categoryId: null,
        thumbnail: '',
        tags: [],
        top: 0
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
      categoryList: state => isEmpty(state.tree) ? [] : state.tree[0].children
    }),
    ...mapState('article/tags', {
      tagsAllList: state => state.allList
    })
  },

  created () {
    this._getCategoryList()
  },

  methods: {
    ...mapMutations('article/articleList', ['UPDATE_CURRENT_PAGE']),
    ...mapActions('article/tags', {
      getTagsAllList: 'getAllList'
    }),
    ...mapActions('article/category', {
      getCategoryList: 'getList'
    }),

    async _getCategoryList () {
      this.$_Dcommon.showLoading('加载中...')
      await this.getCategoryList()
      await this.getTagsAllList()
      this.$_Dcommon.hideLoading()
      this.$route.query.id && this._getDetail()
    },

    async _getDetail () {
      try {
        this.$_Dcommon.showLoading('文章详情加载中...')
        const { data } = await API['article/article'].getDetail(this.$route.query.id)
        this.$_Dcommon.hideLoading()
        this.formModel = Object.assign(this.formModel, data)
      } catch (err) {
        this.$_Dcommon.hideLoading()
      }
    },

    async _uploadThumbnail () {
      this.loading = true
      const file = await selectFileHandler('image')
      try {
        const { data } = await uploadFile(file, {
          type: 'editor'
        })
        this.loading = false
        this.formModel.thumbnail = data[0].url
      } catch (err) {
        this.loading = false
        this.$_Dcommon.showMessage({
          type: 'error',
          message: '图片上传失败'
        })
      }
    },

    _save () {
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        this.$_Dcommon.showLoading('保存中...')
        await API['article/article'].save({
          ...this.formModel,
          tags: JSON.stringify(this.formModel.tags)
        })
        this.$_Dcommon.hideLoading()
        this.$_Dcommon.showMessage({
          type: 'success',
          message: '文章保存成功'
        })
        this._close()
      })
    },

    _editorChange({ styleSheets }) {
      this.editorStyle = styleSheets
    },

    _preview() {
      const newWindow = window.open('', '_blank')
      newWindow.document.write(`<style>${this.editorStyle.join('')}</style><div style="width: 80%; margin: 0 auto;">${this.formModel.content}</div>`)
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
.upload-images {
  ::v-deep .el-upload-list__item,
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
  }

  ::v-deep .el-upload--picture-card {
    background: none;
    line-height: 120px;
  }
}
::v-deep .el-form-item__content {
  > .ck-editor__editable {
    min-height: 300px;
    border: 1px solid var(--color-border);
  }
}
</style>
