/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-19 08:39:53
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-20 08:50:18
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'


Vue.use(VueCodeMirror)
Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
Vue.prototype.$EventBus = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
