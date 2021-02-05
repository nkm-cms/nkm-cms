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
  stepsComponentExample,
  audioTool,
  boldTool,
  cleanTool,
  colorTool,
  emojiTool,
  fontFamilyTool,
  fontSizeTool,
  headingTool,
  historyBackTool,
  historyForwardTool,
  imageTool,
  italicTool,
  lineHeightTool,
  linkTool,
  olTool,
  strikeThroughTool,
  subscriptTool,
  superscriptTool,
  textAlignTool,
  textBackgroundTool,
  textIndentTool,
  ulTool,
  underlineTool,
  videoTool,
  unlinkTool,
  findTool,
  insertObjectTool,
  tableTool,
  insertParagraphBeforeTool,
  insertParagraphAfterTool
} from '@tanbo/textbus'
import '@tanbo/textbus/bundles/textbus.min.css'
import uploadFile, { selectFileHandler } from '@/utils/upload'
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
        toolbar: [
          [historyBackTool, historyForwardTool, cleanTool],
          [insertObjectTool],
          [headingTool, fontSizeTool, fontFamilyTool],
          [boldTool, italicTool, strikeThroughTool, underlineTool, colorTool, textBackgroundTool],
          [lineHeightTool],
          [insertParagraphBeforeTool, insertParagraphAfterTool],
          [olTool, ulTool],
          [textIndentTool],
          [subscriptTool, superscriptTool],
          [textAlignTool],
          [linkTool, unlinkTool],
          [imageTool, videoTool, audioTool, emojiTool],
          [tableTool],
          [findTool]
        ],
        uploader(type) {
          return new Promise((resolve, reject) => {
            (async () => {
              try {
                const file = await selectFileHandler(type)
                const { data } = await uploadFile(file, {
                  type: 'editor'
                })
                resolve(data.data[0].url)
              } catch (err) {
                reject()
              }
            })()
          })
        }
      })

      // 监听value改变设置到编辑器中并取消监听
      const unwatch = this.$watch('value', value => {
        editor.setContents(value).then(() => value !== '<p><br></p>' && unwatch())
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

  .textbus-toolbar-group {
    padding-right: 5px;
    border-right: 1px solid #d0d0d0;
    border-radius: 0;

    &:last-child {
      border: 0;
    }
  }

  .textbus-toolbar-action {
    &:hover {
      box-shadow: none;
      background: rgba(0, 0, 0, 0.04);
    }
  }

  .textbus-toolbar-action {
    &[title="字体大小"] {
      margin-right: 5px;
    }
  }
}
</style>
