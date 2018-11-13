import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import home from '@/components/home/home'
import users from '@/components/users/users'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,

      children: [
        {
          path: '/users',
          component: users
        }
      ]
    }
  ]
})
// 给路由对象设置导航守卫
// to: 去哪儿
// from: 从哪儿来
// next() : 指定跳转到哪个组件  next():表示放行  next(false)  next('/login')
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
