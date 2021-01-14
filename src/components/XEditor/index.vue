<template>
  <div ref="editor"></div>
</template>

<script>
import 'reflect-metadata'
import {
  createEditor,
  imageCardComponentExample,
  todoListComponentExample,
  jumbotronComponentExample,
  wordExplainComponentExample,
  timelineComponentExample,
  progressComponentExample,
  stepsComponentExample
} from '@tanbo/textbus'
import '@tanbo/textbus/bundles/textbus.min.css'
import API from '@/api'
let editor = null

export default {
  name: 'XEditor',

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  mounted() {
    this._createEditor()
  },

  beforeDestroy() {
    editor.destroy()
  },

  methods: {
    async _createEditor() {
      editor = createEditor(this.$refs.editor, {
        componentLibrary: [
          imageCardComponentExample,
          todoListComponentExample,
          jumbotronComponentExample,
          wordExplainComponentExample,
          timelineComponentExample,
          progressComponentExample,
          stepsComponentExample
        ],
        uploader(type) {
          if (type === 'image') {
            return new Promise((resolve, reject) => {
              const fileInput = document.createElement('input')
              fileInput.setAttribute('type', 'file')
              fileInput.setAttribute('accept', 'image/*')
              fileInput.onchange = async event => {
                try {
                  const forData = new FormData()
                  const files = event.target.files
                  forData.append('type', 'editor')
                  for (let i = 0; i < files.length; i++) {
                    forData.append('files', files[i])
                  }
                  const { data } = await API.upload(forData)
                  resolve(data.data[0].url)
                } catch (err) {
                  reject()
                }
              }
              fileInput.click()
            })
          }
        }
      })

      // 监听value改变设置到编辑器中并取消监听
      const unwatch = this.$watch('value', value => {
        editor
          .setContents(value)
          .then(() => value !== '<p><br></p>' && unwatch())
      })

      editor.onChange.subscribe(() => {
        this.$emit('input', editor.getContents().content)
        this.$emit('change', editor.getContents())
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .textbus-container {
  input {
    appearance: auto;
    vertical-align: middle;
  }

  .textbus-toolbar-action {
    &[title="段落与标题"],
    &[title="字体大小"],
    &[title="字体"],
    &[title="对齐方式"] {
      border: 1px solid #dddee1;
    }

    &[title="字体大小"] {
      margin-right: 5px;
    }
  }
}
</style>
