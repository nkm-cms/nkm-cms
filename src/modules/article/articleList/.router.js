export default [
  {
    name: 'ArticleList',
    path: 'list',
    meta: {
      title: '文章管理'
    },
    component: () => import(/* webpackChunkName: 'article' */ './index')
  }, {
    name: 'ArticleEdit',
    path: 'edit/:id?',
    meta: {
      title: '文章编辑'
    },
    component: () => import(/* webpackChunkName: 'article' */ './edit')
  }
]
