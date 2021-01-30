import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '仪表板',
      icon: 'mdi-view-dashboard'
    }
  },
  {
    path: '/keyword',
    name: 'Keyword',
    meta: {
      title: '关键词分析',
      icon: 'mdi-chart-line'
    },
    component: () => import('@/views/Keywords.vue'),
  },
  {
    path: '/job',
    name: 'Job',
    meta: {
      title: '计划任务',
      icon: 'mdi-clock-time-two-outline'
    },
    component: () => import('@/views/Job.vue')
  },
  {
    path: '/sale',
    name: 'Sale',
    meta: {
      hidden: true,
      title: '销量分析',
      icon: 'mdi-chart-line'
    },
    component: () => import('@/views/Sale.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      hidden: true,
      title: '关于',
      icon: 'mdi-chart-line'
    },
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
