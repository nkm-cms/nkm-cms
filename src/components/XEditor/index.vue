<template>
  <div ref="editor"></div>
</template>

<script>
import {
  createEditor,

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
  insertParagraphAfterTool,

  imageCardComponentExample,
  todoListComponentExample,
  jumbotronComponentExample,
  wordExplainComponentExample,
  timelineComponentExample,
  progressComponentExample,
  stepsComponentExample,
  katexComponentExample,

  TOOLS,
  COMPONENT_CREATORS,
  DEVICE_OPTIONS
} from '@tanbo/textbus'
import '@tanbo/textbus/bundles/textbus.min.css'
import uploadFile, { selectFileHandler } from '@/utils/upload'

export default {
  name: 'XEditor',

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      editor: null
    }
  },

  mounted() {
    this._createEditor()
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    async _createEditor() {
      this.editor = createEditor(this.$refs.editor, {
        providers: [
          {
            provide: TOOLS,
            useValue: [
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
            ]
          },
          {
            provide: DEVICE_OPTIONS,
            useValue: [{
              label: 'PC',
              value: '100%',
              default: true,
            }, {
              label: 'iPhone5/SE',
              value: '320px'
            }, {
              label: 'iPhone6/7/8/X',
              value: '375px'
            }, {
              label: 'iPhone6/7/8 Plus',
              value: '414px'
            }, {
              label: 'iPad',
              value: '768px'
            }, {
              label: 'iPad Pro',
              value: '1024px'
            }, {
              label: 'A4',
              value: '842px'
            }]
          },
          {
            provide: COMPONENT_CREATORS,
            useValue: [
              imageCardComponentExample,
              todoListComponentExample,
              jumbotronComponentExample,
              wordExplainComponentExample,
              timelineComponentExample,
              progressComponentExample,
              stepsComponentExample,
              katexComponentExample
            ]
          }
        ],
        uploader(type) {
          return new Promise((resolve, reject) => {
            (async () => {
              try {
                const file = await selectFileHandler(type)
                const { data } = await uploadFile(file, {
                  type: 'editor'
                })
                resolve(data[0].url)
              } catch (err) {
                reject()
              }
            })()
          })
        }
      })

      // 监听value改变设置到编辑器中并取消监听
      const unwatch = this.$watch('value', value => {
        this.editor.setContents(value).then(() => value !== '<p><br></p>' && unwatch())
      })

      this.editor.onChange.subscribe(() => {
        this.$emit('input', this.editor.getContents().content)
        this.$emit('change', this.editor.getContents())
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .textbus-container {
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

  .textbus-status-bar {
    > div:not(:last-of-type) {
      margin-right: 5px;
    }
  }
}
</style>
