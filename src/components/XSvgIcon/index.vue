<template>
  <svg
    class="x-svg-icon"
    aria-hidden="true"
    :style="style"
  >
    <use :xlink:href="`#icon-${icon}`"></use>
  </svg>
</template>
<script>
export default {
  name: 'XSvgIcon',
  props: {
    icon: {
      type: String,
      default: '',
      required: true
    },
    customStyle: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    align: {
      type: String,
      default: null
    }
  },

  computed: {
    style() {
      return {
        ...this.customStyle,
        width: this.size || this.width,
        height: this.size || this.height,
        verticalAlign: this.align
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.x-svg-icon {
  width: 24px;
  height: 24px;
}
</style>
