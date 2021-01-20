export default {
  path: 'media',
  name: 'Media',
  meta: {
    title: '媒体库'
  },
  component: () => import(/* webpackChunkName: "media" */ './index.vue')
}
