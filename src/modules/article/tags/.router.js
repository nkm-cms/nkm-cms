export default {
  name: 'ArticleTags',
  path: 'tags',
  meta: {
    title: '标签管理'
  },
  component: () => import(/* webpackChunkName: 'tags' */ './index')
}
