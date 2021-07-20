import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import MovieListPage from '@/components/MovieListPage'
import DetailMoviePage from '@/components/DetailMoviePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'movielist',
      component: App
    },
    {
      path: '/:id',
      name: 'detailmovie',
      component: DetailMoviePage
    }
  ]
})
