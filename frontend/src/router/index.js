import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Temperate from '../views/Temperate'
import Humid from '../views/Humid'
import Fire from '../views/Fire'
import Light from '../views/Light'
import ElecticPower from '../views/ElecticPower'
import Water from '../views/Water'
import Pm from '../views/Pm'
import Dust from '../views/Dust'
import Co2 from '../views/Co2'
import Admin from '../views/Admin'
//import About from '../views/About'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },{
    path: '/Temperate',
    name: 'Temperate',
    component: Temperate
  },{
    path: '/Humid',
    name: 'Humid',
    component: Humid
  },{
    path: '/Fire',
    name: 'Fire',
    component: Fire
  },{
    path: '/Light',
    name: 'Light',
    component: Light
  },{
    path: '/ElecticPower',
    name: 'ElecticPower',
    component: ElecticPower
  },
  {
    path: '/Water',
    name: 'Water',
    component: Water
  },{
    path: '/Pm',
    name: 'Pm',
    component: Pm
  },{
    path: '/Co2',
    name: 'Co2',
    component: Co2
  },{
    path: '/Dust',
    name: 'Dust',
    component: Dust
  },{
    path: '/Admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
