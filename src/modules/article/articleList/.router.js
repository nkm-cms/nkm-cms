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
    beforeEnter (to, from, next) {
      if (to.params.id === ':id') to.params.id = ''
      next()
    },
    component: () => import(/* webpackChunkName: 'article' */ './edit')
  }
]
