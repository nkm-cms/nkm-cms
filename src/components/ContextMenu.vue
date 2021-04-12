<script>
export default {
  name: 'Contextmenu',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    menus: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      isShowMenu: false,
      menuStyles: {
        top: 0,
        left: 0
      }
    }
  },

  mounted() {
    this.contextMenuClick()
    this.handleHideMenu()
  },

  methods: {
    contextMenuClick() {
      this.$refs.wrapper.oncontextmenu = event => {
        event.preventDefault()
        document.body.querySelectorAll('.contextmenu-children').forEach(el => {
          el.style.display = 'none'
        })
        this.menuStyles.top = `${event.pageY}px`
        this.menuStyles.left = `${event.pageX}px`
        this.isShowMenu = true
      }
    },

    handleHideMenu() {
      const handle = () => {
        this.isShowMenu = false
      }
      document.addEventListener('click', handle)
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('click', handle)
      })
    },

    itemClick(event, item, callback) {
      event.stopPropagation()
      this.isShowMenu = false
      this.$emit('item-click', item)
      typeof callback === 'function' && callback()
    }
  },

  render(h) {
    return h(this.tag, {
      ref: 'wrapper',
      class: 'contextmenu-wrapper'
    }, [
      this.$slots.default,
      this.isShowMenu && h('ul', {
        class: 'contextmenu-children',
        style: this.menuStyles
      }, this.menus.map(item => {
        return h('li', {
          class: 'contextmenu-item',
          on: {
            click: $event => this.itemClick($event, item, item.event)
          }
        }, item.name)
      }))
    ])
  }
}
</script>

<style lang="scss" scoped>
.contextmenu-wrapper {
  position: relative;
}
.contextmenu-children {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  overflow: hidden;
  width: 150px;
  padding: 5px 0;
  background: #fff;
  border: 1px solid $color-border;
  border-radius: 5px;
  box-shadow: $box-shadow;
  text-align: left;
}
.contextmenu-item {
  padding: 5px 15px;
  cursor: pointer;

  &:hover {
    background: $color-theme;
    color: #fff;
  }
}
</style>
