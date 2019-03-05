import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'viewport',
      component: require('@/components/Viewport').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
