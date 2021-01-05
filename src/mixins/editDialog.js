export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },

    data: {
      type: Object,
      default: () => ({})
    },

    type: {
      type: String,
      default: 'add'
    }
  },

  methods: {
    __close () {
      this._reset && this._reset()
      this.$emit('close')
      this.$emit('update:visible', false)
      this.$emit('update:type', 'add')
    }
  }
}
