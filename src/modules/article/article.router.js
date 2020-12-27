export default [
  {
    name: 'Article',
    path: '/article',
    meta: {
      title: '文章管理'
    },
    component: () => import(/* webpackChunkName: 'article' */ './index')
  }, {
    name: 'ArticleEdit',
    path: '/article/edit/:id?',
    meta: {
      title: '文章编辑'
    },
    component: () => import(/* webpackChunkName: 'article' */ './edit')
  }
]
