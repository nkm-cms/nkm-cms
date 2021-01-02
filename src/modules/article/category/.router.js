export default {
  name: 'ArticleCategory',
  path: 'category',
  meta: {
    title: '栏目管理'
  },
  component: () => import(/* webpackChunkName: 'category' */ './index')
}
