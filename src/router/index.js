import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index';

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta:{requireAuth:true}
  },
  {
    path: '/login',
    name: 'login',

    component: () => import('../views/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  const routerAuth=to.matched.some(record=>record.meta.requireAuth);
  if(routerAuth && store.state.token ===''){
  
    next({name: 'login'})

  }else{
   
    next()
  }
})

export default router
