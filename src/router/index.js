/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-19 08:39:53
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-19 08:58:34
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
export default new Router({
  routes: [
    {
      path: '/project/:id',
      name: '',
      component: resolve => require(['../components/cProject.vue'],resolve)
    }
  ]
})
