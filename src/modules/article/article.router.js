import category from './category/.router'
import articleList from './articleList/.router'

export default {
  path: 'article',
  name: 'Article',
  component: {
    render () {
      return (<router-view/>)
    }
  },
  meta: {
    title: '文章管理'
  },
  children: [
    category,
    ...articleList
  ]
}
