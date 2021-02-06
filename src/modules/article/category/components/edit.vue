<template>
  <x-dialog
    :title="dialogTitle"
    :visible="visible"
    width="500px"
    @close="__close"
  >
    <el-form ref="form" :model="formModel" :rules="rules" label-width="80px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="formModel.name"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="编码">
        <el-input v-model="formModel.code"></el-input>
      </el-form-item>
      <el-form-item prop="path" label="路径">
        <el-input v-model="formModel.path"></el-input>
      </el-form-item>
      <el-form-item prop="parentId" label="父级栏目">
        <x-select-tree
          v-model="formModel.parentId"
          :data="tree"
          clearable
          class="w-100"
          :tree-props="{
            label: 'name'
          }"
        />
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input v-model="formModel.sort"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-radio v-model="formModel.type" label="list">列表</el-radio>
        <el-radio v-model="formModel.type" label="page">页面</el-radio>
      </el-form-item>
      <el-form-item prop="visible" label="是否可见">
        <el-radio v-model="formModel.visible" :label="1">是</el-radio>
        <el-radio v-model="formModel.visible" :label="0">否</el-radio>
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
import { mapState } from 'vuex'
import editDiglog from '@/mixins/editDialog'
import { matchCode } from '@/utils/regexp'
export default {
  name: 'Edit',

  mixins: [editDiglog],

  data () {
    return {
      formModel: {
        name: '',
        code: '',
        path: '',
        type: 'list',
        parentId: 0,
        sort: 0,
        visible: 1
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空' }
        ],
        code: [
          { required: true, message: '编码不能为空' },
          {
            validator: (rule, value, cb) => {
              return matchCode(value) ? cb() : cb('编码格式错误，只能输入：[a-z\\d-_]')
            }
          }
        ]
      }
    }
  },

  computed: {
    ...mapState('article/category', ['tree']),
    dialogTitle () {
      const type = {
        add: '新增栏目',
        edit: '编辑栏目'
      }
      return type[this.type]
    }
  },

  watch: {
    visible (val) {
      if (val) {
        if (this.type === 'edit') {
          this.formModel = Object.assign({}, this.formModel, this.data)
        }
      }
    }
  },

  methods: {
    _save () {
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        window.common.showLoading('保存中...')
        await API['article/category'].save(this.formModel)
        window.common.hideLoading()
        this.__close()
        this.$emit('success')
      })
    },

    _reset () {
      this.$refs.form.resetFields()
      this.$set(this, 'formModel', this.$options.data().formModel)
    }
  }
}
</script>

<style lang="scss" scoped></style>
