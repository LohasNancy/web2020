import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from "./plugins/i18n.js"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/common.css";
import './plugins/element.js'
import './plugins/MyComponents'
import "./router/permission"
import jwt from "jwt-decode";
import "./utils/eventbus";

import { initProject } from './utils/init'

initProject();//初始化
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
