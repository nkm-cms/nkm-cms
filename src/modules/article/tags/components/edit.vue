<template>
  <x-dialog
    :title="title"
    :visible="visible"
    width="500px"
    @close="__close"
  >
    <el-form ref="form" :model="formModel" :rules="rules" label-width="60px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formModel.name"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="formModel.code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="_save">保存</el-button>
        <el-button @click="__close">关闭</el-button>
      </el-form-item>
    </el-form>
  </x-dialog>
</template>

<script>
import API from '@/api'
import dialogMixin from '@/mixins/editDialog'
import { matchCode, matchName } from '@/utils/regexp'
export default {
  name: 'TagsEdit',

  mixins: [dialogMixin],

  data() {
    return {
      formModel: {
        name: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称' },
          {
            validator: (rule, value, cb) => matchName(value) ? cb() : cb('名称只能包含中文、字母、数字')
          }
        ],
        code: [
          { required: true, message: '请输入编码' },
          {
            validator: (rule, value, cb) => matchCode(value) ? cb() : cb('编码只能包含字母、数字、下划线、横线')
          }
        ]
      }
    }
  },

  computed: {
    title() {
      const type = {
        add: '新增',
        edit: '编辑'
      }
      return `${type[this.type]}标签`
    }
  },

  watch: {
    data(value) {
      if (this.type === 'edit') this.formModel = Object.assign({}, this.formModel, value)
    }
  },

  methods: {
    _save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$_Dcommon.showLoading('保存中...')
          await API['article/tags'].save(this.formModel)
          this.$_Dcommon.hideLoading()
          this.$_Dcommon.showMessage({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('success')
          this.__close()
        }
      })
    },

    _reset() {
      this.$refs.form.resetFields()
      this.formModel = this.$options.data().formModel
    }
  }
}
</script>
